# src/load_data.py

import csv
import redis
import json

# Connect to Redis
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

# Redis keys
AGGREGATE_KEY = "aggregate_data"
GAS_KEY = "gas_data"

def load_data():
    industries = {}

    # Load aggregate emissions data
    with open('./data/aggregate_emissions.csv', mode='r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            naics = row['2017 NAICS Code']
            industries[naics] = {
                "NAICS_Code": naics,
                "2017 NAICS Title": row.get('2017 NAICS Title', ''),
                "GHG": [row.get('GHG', '')],
                "Supply_Chain_Emission_Factors_with_Margins": row.get('Supply Chain Emission Factors with Margins', '')
            }

            # Store the aggregate data in Redis hash (using NAICS Code as the field)
            r.hset(AGGREGATE_KEY, naics, json.dumps(industries[naics]))

    # Load gas emissions data
    with open('./data/gas_emissions.csv', mode='r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            naics = row['2017 NAICS Code']
            if naics in industries:
                industries[naics]["GHG"] = row.get('GHG', '')
                industries[naics]["Unit"] = row.get('Unit', '')
                industries[naics]["Emission_Factor"] = row.get('Supply Chain Emission Factors without Margins', '')

                # Store the updated gas data in Redis hash (using NAICS Code or Gas Name as the field)
                r.hset(GAS_KEY, naics, json.dumps(industries[naics]))

    print(f"Loaded {len(industries)} industries into Redis under keys '{AGGREGATE_KEY}' and '{GAS_KEY}'.")

if __name__ == "__main__":
    load_data()


