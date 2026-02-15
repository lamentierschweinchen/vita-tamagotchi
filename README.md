# Project VITA - On-Chain Tamagotchi

A simple, high-delight on-chain "Tamagotchi" on MultiversX.

## Overview
A single, shared SFT represents a community pet that must be "fed" to survive.
- **Health Window**: 24 hours.
- **Feeding**: Send 0.005 EGLD to reset the clock.
- **States**: Happy (0-6h), Hungry (6-18h), Critical (18-24h), Dead (>24h).
- **Permadeath**: If it dies, it's game over.

## Tech Stack
- **Smart Contract**: MultiversX (Rust)
- **Frontend**: Next.js, Tailwind CSS, useDapp

## Project Structure
- `contract/`: Rust smart contract.
- `frontend/`: Next.js dApp.
- `scripts/`: Deployment scripts.

## Setup

### Prerequisites
- `mxpy` CLI
- Node.js & npm

### Smart Contract
1. Build:
   ```bash
   cd contract/meta
   cargo run -- build
   ```
   Output: `contract/output/vita-tamagotchi.wasm`

2. Deploy:
   Update `scripts/deploy.py` with your PEM file.
   ```bash
   python3 scripts/deploy.py
   ```

### Frontend
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Configure:
   Update `frontend/config.ts` with the deployed contract address.

3. Run:
   ```bash
   npm run dev
   ```

## Development
- `mxpy` version used: 0.64.1
- Contract uses `TimestampSeconds` for time tracking.
- Frontend polls API for status updates.

## License
MIT
