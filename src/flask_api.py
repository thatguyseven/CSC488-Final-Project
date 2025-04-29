from flask import Flask, request, jsonify
from flask_cors import CORS
import redis
import json
import uuid

app = Flask(__name__)
CORS(app)

# Connect to Redis
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

# Redis keys
AGGREGATE_KEY = "aggregate_data"
GAS_KEY = "gas_data"
JOB_QUEUE = "job_queue"

# ----------------------
# CRUD Endpoints for Aggregate Data
# ----------------------

@app.route('/create-aggregate', methods=['POST'])
def create_aggregate():
    data = request.get_json()
    code = data.get('NAICS_Code')

    if not code:
        return jsonify({"error": "NAICS_Code is required."}), 400

    r.hset(AGGREGATE_KEY, code, json.dumps(data))
    return jsonify({"message": f"Aggregate entry for code {code} created."}), 201

@app.route('/create-gas', methods=['POST'])
def create_gas():
    data = request.get_json()
    gas_name = data.get('Gas_Name')

    if not gas_name:
        return jsonify({"error": "Gas_Name is required."}), 400

    r.hset(GAS_KEY, gas_name, json.dumps(data))
    return jsonify({"message": f"Gas entry for {gas_name} created."}), 201

@app.route('/get-aggregate', methods=['GET'])
def get_aggregate():
    # Fetch all aggregate emissions data from Redis
    aggregate_data = r.hgetall(AGGREGATE_KEY)
    return jsonify(aggregate_data)


@app.route('/get-gas', methods=['GET'])
def get_gas():
    # Fetch all gas emissions data from Redis
    gas_data = r.hgetall(GAS_KEY)
    
    # Check if the data is being retrieved correctly
    if not gas_data:
        return jsonify({"error": "No gas data found."}), 404  # Handle case where no data exists

    return jsonify(gas_data)  # Return the fetched gas data

@app.route('/delete-aggregate/<naics_code>', methods=['DELETE'])
def delete_aggregate(naics_code):
    if r.hexists(AGGREGATE_KEY, naics_code):
        r.hdel(AGGREGATE_KEY, naics_code)
        return jsonify({"message": f"Aggregate record for {naics_code} deleted."}), 200
    return jsonify({"error": "Aggregate record not found."}), 404

@app.route('/delete-gas/<naics_code>', methods=['DELETE'])
def delete_gas(naics_code):
    deleted = False
    all_gas = r.hgetall(GAS_KEY)
    for key, value in all_gas.items():
        record = json.loads(value)
        if str(record.get("2017 NAICS Code")) == naics_code:
            r.hdel(GAS_KEY, key)
            deleted = True
    if deleted:
        return jsonify({"message": f"Gas records for NAICS code {naics_code} deleted."}), 200
    return jsonify({"error": "No gas records found for NAICS code."}), 404

# ----------------------
# Graph Endpoints
# ----------------------

@app.route('/graph-industry', methods=['POST'])
def graph_industry():
    data = request.get_json()
    codes = data.get("codes")

    if not codes:
        return jsonify({"error": "List of industry codes is required."}), 400

    entries = {}
    for code in codes:
        entry = r.hget(AGGREGATE_KEY, code)
        if entry:
            entries[code] = json.loads(entry)

    if not entries:
        return jsonify({"error": "No valid industry codes found."}), 404

    job_id = str(uuid.uuid4())
    r.rpush(JOB_QUEUE, json.dumps({
        "job_type": "graph_industry",
        "job_id": job_id,
        "entries": entries
    }))

    return jsonify({"message": "Graph job submitted.", "job_id": job_id}), 202


@app.route('/graph-gas', methods=['POST'])
def graph_gas():
    data = request.get_json()
    gases = data.get("gases")

    if not gases:
        return jsonify({"error": "List of gases is required."}), 400

    entries = {}
    for gas in gases:
        entry = r.hget(GAS_KEY, gas)
        if entry:
            entries[gas] = json.loads(entry)

    if not entries:
        return jsonify({"error": "No valid gas names found."}), 404

    job_id = str(uuid.uuid4())
    r.rpush(JOB_QUEUE, json.dumps({
        "job_type": "graph_gas",
        "job_id": job_id,
        "entries": entries
    }))

    return jsonify({"message": "Gas graph job submitted.", "job_id": job_id}), 202


# ----------------------
# Main
# ----------------------

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
