export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || 'erd1qqqqqqqqqqqqqpgqky8dmztwf3he9hkt64udq235unx5y687pkkqher92f';
export const dAppName = process.env.NEXT_PUBLIC_DAPP_NAME || 'VITA Tamagotchi';

const allowedEnvironments = ['devnet', 'testnet', 'mainnet'] as const;
type MvxEnvironment = (typeof allowedEnvironments)[number];

const requestedEnvironment = (process.env.NEXT_PUBLIC_ENVIRONMENT || 'devnet').toLowerCase();
export const environment: MvxEnvironment = allowedEnvironments.includes(
    requestedEnvironment as MvxEnvironment
)
    ? (requestedEnvironment as MvxEnvironment)
    : 'devnet';
