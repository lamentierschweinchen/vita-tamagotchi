import { NextResponse } from 'next/server';

import { contractAddress, environment } from '@/config';

import { getApiBaseUrl, parseGuardiansResponse } from '@/lib/guardians';

export async function GET(req: Request) {
    const url = new URL(req.url);
    const limitParam = url.searchParams.get('limit');
    const limit = Math.min(Math.max(Number(limitParam || 10), 1), 50);

    const apiBaseUrl = getApiBaseUrl(environment);

    try {
        const upstreamUrl = new URL(`${apiBaseUrl}/accounts/${contractAddress}/transactions`);
        upstreamUrl.searchParams.set('function', 'feed');
        upstreamUrl.searchParams.set('status', 'success');
        upstreamUrl.searchParams.set('size', String(limit));
        upstreamUrl.searchParams.set('order', 'desc');

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10_000);

        let res: Response;
        try {
            res = await fetch(upstreamUrl.toString(), { cache: 'no-store', signal: controller.signal });
        } finally {
            clearTimeout(timeout);
        }
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new Error(`Upstream API failed (${res.status}): ${text.slice(0, 200)}`);
        }

        const json = (await res.json()) as unknown;
        const guardians = parseGuardiansResponse(json);

        return NextResponse.json(
            { guardians },
            { headers: { 'Cache-Control': 's-maxage=10, stale-while-revalidate=60' } }
        );
    } catch (err) {
        console.error(
            JSON.stringify({
                msg: 'api_guardians_error',
                env: environment,
                contractAddress,
                apiBaseUrl,
                error: err instanceof Error ? err.message : String(err),
            })
        );

        return NextResponse.json(
            { guardians: [], error: 'Failed to fetch guardians from MultiversX API' },
            { status: 502, headers: { 'Cache-Control': 'no-store' } }
        );
    }
}
