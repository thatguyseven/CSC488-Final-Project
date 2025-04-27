# src/load_data.py

import csv
import redis
import json

# Connect to Redis
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

# Redis key
DATASET_KEY = "ghg_factors"

def load_data():
    industries = {}

    # Load aggregate emissions data
    with open('data/aggregate_emissions.csv', mode='r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            naics = row['2017 NAICS Code']
            industries[naics] = {
                "NAICS_Code": naics,
                "2017 NAICS Title": row.get('2017 NAICS Title', ''),
                "Supply_Chain_Emission_Factors_with_Margins": row.get('Supply Chain Emission Factors with Margins', '')
            }

    # Load gas emissions data
    with open('data/gas_emissions.csv', mode='r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            naics = row['2017 NAICS Code']
            if naics in industries:
                industries[naics]["GHG"] = row.get('GHG', '')
                industries[naics]["Unit"] = row.get('Unit', '')
                industries[naics]["Emission_Factor"] = row.get('Supply Chain Emission Factors without Margins', '')

    # Save into Redis
    for naics_code, record in industries.items():
        r.hset(DATASET_KEY, naics_code, json.dumps(record))

    print(f"Loaded {len(industries)} industries into Redis under key '{DATASET_KEY}'.")

if __name__ == "__main__":
    load_data()
