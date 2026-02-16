export type Guardian = {
    address: string;
    timestamp: number;
    txHash: string;
    value: string;
};

function isRecord(v: unknown): v is Record<string, unknown> {
    return typeof v === 'object' && v !== null;
}

function pickString(obj: Record<string, unknown>, keys: string[]): string {
    for (const k of keys) {
        const v = obj[k];
        if (typeof v === 'string' && v.length > 0) return v;
    }
    return '';
}

function pickNumber(obj: Record<string, unknown>, keys: string[]): number {
    for (const k of keys) {
        const v = obj[k];
        if (typeof v === 'number' && Number.isFinite(v)) return v;
        if (typeof v === 'string') {
            const n = Number(v);
            if (Number.isFinite(n)) return n;
        }
    }
    return 0;
}

function pickValueAsString(obj: Record<string, unknown>, keys: string[]): string {
    for (const k of keys) {
        const v = obj[k];
        if (typeof v === 'string') return v;
        if (typeof v === 'number' && Number.isFinite(v)) return String(v);
    }
    return '0';
}

export function getApiBaseUrl(rawEnv: string): string {
    const v = (rawEnv || 'devnet').toLowerCase();
    if (v === 'testnet') return 'https://testnet-api.multiversx.com';
    if (v === 'mainnet' || v === 'prod' || v === 'production') return 'https://api.multiversx.com';
    return 'https://devnet-api.multiversx.com';
}

export function parseGuardiansResponse(json: unknown): Guardian[] {
    const items: unknown[] = Array.isArray(json)
        ? json
        : isRecord(json) && Array.isArray(json.data)
            ? (json.data as unknown[])
            : [];

    const guardians: Guardian[] = [];
    for (const item of items) {
        if (!isRecord(item)) continue;

        const address = pickString(item, ['sender', 'from', 'senderAddress']);
        const txHash = pickString(item, ['txHash', 'hash', 'originalTxHash']);

        if (!address || !txHash) continue;

        guardians.push({
            address,
            timestamp: pickNumber(item, ['timestamp']),
            txHash,
            value: pickValueAsString(item, ['value']),
        });
    }

    return guardians;
}
