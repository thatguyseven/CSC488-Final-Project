# src/worker.py

import redis
import json
import matplotlib.pyplot as plt
import os

# Connect to Redis (important: NOT localhost if running inside container)
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

# Folder to save plots
PLOT_DIR = "plots"
os.makedirs(PLOT_DIR, exist_ok=True)

def plot_industries(entries, job_id):
    industries = [v['2017 NAICS Title'] for v in entries.values()]
    emissions = [float(v.get('Supply_Chain_Emission_Factors_with_Margins', 0)) for v in entries.values()]

    plt.figure(figsize=(14, 8))  # wider figure
    plt.bar(industries, emissions, edgecolor='black')  # thin borders on bars
    plt.title('Aggregate Emissions by Industry', fontsize=18)
    plt.xlabel('Industry', fontsize=14)
    plt.ylabel('Emission Factors', fontsize=14)
    plt.xticks(rotation=45, ha='right', fontsize=10)
    plt.yticks(fontsize=12)
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.tight_layout()
    plot_path = os.path.join(PLOT_DIR, f"{job_id}_industry_plot.png")
    plt.savefig(plot_path)
    plt.close()
    print(f"Saved improved industry plot: {plot_path}")



def plot_gases(entries, job_id):
    gases = [v.get('Gas', 'Unknown') for v in entries.values()]
    emissions = [float(v.get('Emission_Factor', 0)) for v in entries.values()]

    plt.figure(figsize=(14, 8))
    plt.bar(gases, emissions, edgecolor='black')
    plt.title('Gas Emissions by Type', fontsize=18)
    plt.xlabel('Gas', fontsize=14)
    plt.ylabel('Emission Factors', fontsize=14)
    plt.xticks(rotation=45, ha='right', fontsize=10)
    plt.yticks(fontsize=12)
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.tight_layout()
    plot_path = os.path.join(PLOT_DIR, f"{job_id}_gas_plot.png")
    plt.savefig(plot_path)
    plt.close()
    print(f"Saved improved gas plot: {plot_path}")



def main():
    print("Worker started... Listening for jobs.")
    while True:
        try:
            _, job_data = r.blpop('job_queue')
            job = json.loads(job_data)
            job_type = job.get('job_type')
            job_id = job.get('job_id')
            entries = job.get('entries')

            print(f"Received job: {job_type}")

            if job_type == 'graph_industry':
                plot_industries(entries, job_id)
            elif job_type == 'graph_gas':
                plot_gases(entries, job_id)
            else:
                print(f"Unknown job type: {job_type}")

        except Exception as e:
            print(f"Error while processing job: {e}")

if __name__ == "__main__":
    main()
