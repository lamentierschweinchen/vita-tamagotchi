import assert from 'node:assert/strict';
import test from 'node:test';

import { getGatewayBaseUrl, queryVmInt } from '../lib/mvxGateway';

test('getGatewayBaseUrl: normalizes environments', () => {
    assert.equal(getGatewayBaseUrl('devnet'), 'https://devnet-gateway.multiversx.com');
    assert.equal(getGatewayBaseUrl('testnet'), 'https://testnet-gateway.multiversx.com');
    assert.equal(getGatewayBaseUrl('mainnet'), 'https://gateway.multiversx.com');
    assert.equal(getGatewayBaseUrl('production'), 'https://gateway.multiversx.com');
    assert.equal(getGatewayBaseUrl(undefined), 'https://devnet-gateway.multiversx.com');
});

test('queryVmInt: returns data field on 200', async () => {
    const originalFetch = globalThis.fetch;

    const mockFetch: typeof fetch = async () =>
        new Response(JSON.stringify({ data: '123' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    globalThis.fetch = mockFetch;

    try {
        const result = await queryVmInt({
            gatewayBaseUrl: 'https://example.invalid',
            scAddress: 'erd1...',
            funcName: 'getTotalFeeds',
            args: [],
            timeoutMs: 1000,
        });
        assert.equal(result, '123');
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test('queryVmInt: supports nested data.data payload', async () => {
    const originalFetch = globalThis.fetch;

    const mockFetch: typeof fetch = async () =>
        new Response(JSON.stringify({ data: { data: '456' }, error: '', code: 'successful' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    globalThis.fetch = mockFetch;

    try {
        const result = await queryVmInt({
            gatewayBaseUrl: 'https://example.invalid',
            scAddress: 'erd1...',
            funcName: 'getLastFedTimestamp',
            args: [],
            timeoutMs: 1000,
        });
        assert.equal(result, '456');
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test('queryVmInt: throws on non-200', async () => {
    const originalFetch = globalThis.fetch;
    const mockFetch: typeof fetch = async () => new Response('nope', { status: 500 });
    globalThis.fetch = mockFetch;

    try {
        await assert.rejects(
            () =>
                queryVmInt({
                    gatewayBaseUrl: 'https://example.invalid',
                    scAddress: 'erd1...',
                    funcName: 'getTotalFeeds',
                    args: [],
                    timeoutMs: 1000,
                }),
            /Gateway VM query failed/
        );
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test('queryVmInt: throws when data is missing', async () => {
    const originalFetch = globalThis.fetch;
    const mockFetch: typeof fetch = async () =>
        new Response(JSON.stringify({ nope: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    globalThis.fetch = mockFetch;

    try {
        await assert.rejects(
            () =>
                queryVmInt({
                    gatewayBaseUrl: 'https://example.invalid',
                    scAddress: 'erd1...',
                    funcName: 'getTotalFeeds',
                    args: [],
                    timeoutMs: 1000,
                }),
            /missing string "data"/
        );
    } finally {
        globalThis.fetch = originalFetch;
    }
});
