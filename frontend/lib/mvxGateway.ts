type Environment = 'devnet' | 'testnet' | 'mainnet';

function normalizeEnv(raw: string | undefined): Environment {
    const v = (raw || 'devnet').toLowerCase();
    if (v === 'testnet') return 'testnet';
    if (v === 'mainnet' || v === 'prod' || v === 'production') return 'mainnet';
    return 'devnet';
}

export function getGatewayBaseUrl(rawEnv: string | undefined): string {
    const env = normalizeEnv(rawEnv);
    if (env === 'devnet') return 'https://devnet-gateway.multiversx.com';
    if (env === 'testnet') return 'https://testnet-gateway.multiversx.com';
    return 'https://gateway.multiversx.com';
}

function withTimeout(ms: number) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), ms);
    return { signal: controller.signal, cancel: () => clearTimeout(id) };
}

function extractVmInt(json: unknown): string | null {
    if (typeof json !== 'object' || json === null) return null;

    const root = json as Record<string, unknown>;
    const direct = root.data;

    if (typeof direct === 'string') return direct;
    if (typeof direct === 'number' && Number.isFinite(direct)) return String(direct);

    if (typeof direct === 'object' && direct !== null) {
        const nested = direct as Record<string, unknown>;

        if (typeof nested.data === 'string') return nested.data;
        if (typeof nested.data === 'number' && Number.isFinite(nested.data)) return String(nested.data);

        if (typeof nested.value === 'string') return nested.value;
        if (typeof nested.value === 'number' && Number.isFinite(nested.value)) return String(nested.value);
    }

    return null;
}

/**
 * Queries a smart contract view endpoint using the Gateway VM "int" endpoint.
 * Returns the first return value as an integer string. (See MultiversX Gateway: /vm-values/int)
 */
export async function queryVmInt(params: {
    gatewayBaseUrl: string;
    scAddress: string;
    funcName: string;
    args?: string[];
    timeoutMs?: number;
}): Promise<string> {
    const { gatewayBaseUrl, scAddress, funcName, args = [], timeoutMs = 10_000 } = params;

    const { signal, cancel } = withTimeout(timeoutMs);
    try {
        const res = await fetch(`${gatewayBaseUrl}/vm-values/int`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ scAddress, funcName, args }),
            signal,
            cache: 'no-store',
        });

        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(`Gateway VM query failed (${res.status}): ${text.slice(0, 200)}`);
        }

        const json = (await res.json()) as unknown;
        const parsed = extractVmInt(json);
        if (parsed === null) {
            throw new Error(`Unexpected Gateway response for ${funcName}: missing string "data" field`);
        }

        return parsed;
    } finally {
        cancel();
    }
}
