import csv
import redis
import json

# Connect to Redis
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

# Redis keys
AGGREGATE_KEY = "aggregate_data"
GAS_KEY = "gas_data"

def load_data():
    # Flush all existing Redis data (optional for clean reloads)
    r.flushdb()
    print("[INFO] Redis database flushed.")

    industries = {}
    gases_seen = set()  # Track gases already saved

    # Load aggregate emissions data
    with open('./data/aggregate_emissions.csv', mode='r') as f:
        reader = csv.DictReader(f)
        print("[INFO] Aggregate Emissions CSV headers:", reader.fieldnames)

        for row in reader:
            naics = row['2017 NAICS Code']
            industries[naics] = {
                "NAICS_Code": naics,
                "2017_NAICS_Title": row.get('2017 NAICS Title', ''),
                "GHGs": [row.get('GHG', '')],  # List of GHGs (starting from "All GHGs" probably)
                "Unit": row.get('Unit', ''),
                "Supply_Chain_Emission_Factors_without_Margins": row.get('Supply Chain Emission Factors without Margins', ''),
                "Margins_of_Supply_Chain_Emission_Factors": row.get('Margins of Supply Chain Emission Factors', ''),
                "Supply_Chain_Emission_Factors_with_Margins": row.get('Supply Chain Emission Factors with Margins', ''),
                "Reference_USEEIO_Code": row.get('Reference USEEIO Code', '')
            }

            r.hset(AGGREGATE_KEY, naics, json.dumps(industries[naics]))
            print(f"[AGGREGATE] Saved NAICS {naics}")

    # Load gas emissions data
    with open('./data/gas_emissions.csv', mode='r') as f:
        reader = csv.DictReader(f)
        print("[INFO] Gas Emissions CSV headers:", reader.fieldnames)

        for row in reader:
            gas_name = row['GHG']
            if not gas_name:
                continue

            # Only store if this gas hasn't been saved yet
            if gas_name not in gases_seen:
                gas_entry = {
                    "2017_NAICS_Code": row.get('2017 NAICS Code', ''),
                    "2017_NAICS_Title": row.get('2017 NAICS Title', ''),
                    "GHG": gas_name,
                    "Unit": row.get('Unit', ''),
                    "Supply_Chain_Emission_Factors_without_Margins": row.get('Supply Chain Emission Factors without Margins', ''),
                    "Margins_of_Supply_Chain_Emission_Factors": row.get('Margins of Supply Chain Emission Factors', ''),
                    "Supply_Chain_Emission_Factors_with_Margins": row.get('Supply Chain Emission Factors with Margins', ''),
                    "Reference_USEEIO_Code": row.get('Reference USEEIO Code', '')
                }

                r.hset(GAS_KEY, gas_name, json.dumps(gas_entry))
                gases_seen.add(gas_name)
                print(f"[GAS] Saved gas {gas_name}")

            # Also append the gas name to the matching NAICS code's GHGs list
            naics_code = row.get('2017 NAICS Code', '')
            if naics_code in industries:
                if gas_name not in industries[naics_code]["GHGs"]:
                    industries[naics_code]["GHGs"].append(gas_name)

    # After updating industries with gases, save industries again
    for naics, industry_data in industries.items():
        r.hset(AGGREGATE_KEY, naics, json.dumps(industry_data))

    print(f"[DONE] Loaded {len(industries)} aggregate industries and {len(gases_seen)} unique gases into Redis.")

if __name__ == "__main__":
    load_data()
