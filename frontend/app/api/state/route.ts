import { NextResponse } from 'next/server';

import { contractAddress, environment } from '@/config';
import { computeMonState } from '@/lib/monState';
import { getGatewayBaseUrl, queryVmInt } from '@/lib/mvxGateway';

export async function GET() {
    const now = Math.floor(Date.now() / 1000);
    const gatewayBaseUrl = getGatewayBaseUrl(environment);

    try {
        const [lastFedRaw, totalFeedsRaw] = await Promise.all([
            queryVmInt({
                gatewayBaseUrl,
                scAddress: contractAddress,
                funcName: 'getLastFedTimestamp',
            }),
            queryVmInt({
                gatewayBaseUrl,
                scAddress: contractAddress,
                funcName: 'getTotalFeeds',
            }),
        ]);

        const lastFedTimestamp = Number(lastFedRaw);
        const totalFeeds = Number(totalFeedsRaw);

        if (!Number.isFinite(lastFedTimestamp) || !Number.isFinite(totalFeeds)) {
            throw new Error(`Invalid VM int response: lastFed=${lastFedRaw} totalFeeds=${totalFeedsRaw}`);
        }

        const state = computeMonState({ lastFedTimestamp, now });

        return NextResponse.json(
            { lastFedTimestamp, totalFeeds, state, now },
            { headers: { 'Cache-Control': 's-maxage=2, stale-while-revalidate=30' } }
        );
    } catch (err) {
        // Avoid spamming logs with successful requests; log only failures with context.
        console.error(
            JSON.stringify({
                msg: 'api_state_error',
                env: environment,
                contractAddress,
                gatewayBaseUrl,
                error: err instanceof Error ? err.message : String(err),
            })
        );

        return NextResponse.json(
            {
                error: 'Failed to fetch state from MultiversX Gateway',
            },
            {
                status: 502,
                headers: { 'Cache-Control': 'no-store' },
            }
        );
    }
}
