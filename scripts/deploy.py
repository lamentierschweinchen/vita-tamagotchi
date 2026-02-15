
import subprocess
import json
import os
import sys

# Configuration
PEM_FILE = "wallet.pem" # Ensure this exists or provide path
PROXY = "https://devnet-api.multiversx.com"
CHAIN_ID = "D"
CONTRACT_PATH = "contract/wasm/vita-tamagotchi.wasm"
GAS_LIMIT = 50000000

def run_command(command):
    try:
        result = subprocess.run(command, shell=True, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        print(f"Error executing command: {command}")
        print(f"Stderr: {e.stderr}")
        return None

def deploy():
    print("Deploying contract...")
    
    if not os.path.exists(CONTRACT_PATH):
        print(f"Error: Contract WASM not found at {CONTRACT_PATH}")
        return

    cmd = f"""
    mxpy contract deploy --bytecode={CONTRACT_PATH} \
    --pem={PEM_FILE} \
    --gas-limit={GAS_LIMIT} \
    --proxy={PROXY} \
    --chain={CHAIN_ID} \
    --recall-nonce \
    --send \
    --outfile=deploy.json
    """
    
    output = run_command(cmd)
    if output:
        print("Deployment successful!")
        # Parse deploy.json to get address if needed, or just look at logs
        if os.path.exists("deploy.json"):
            with open("deploy.json") as f:
                data = json.load(f)
                tx_hash = data.get("emittedTransactionHash")
                print(f"Transaction Hash: {tx_hash}")
                print("Check explorer for contract address.")
    else:
        print("Deployment failed.")

if __name__ == "__main__":
    deploy()
