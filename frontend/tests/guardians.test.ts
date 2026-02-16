import assert from 'node:assert/strict';
import test from 'node:test';

import { getApiBaseUrl, parseGuardiansResponse } from '../lib/guardians';

test('getApiBaseUrl: chooses correct base URL', () => {
    assert.equal(getApiBaseUrl('devnet'), 'https://devnet-api.multiversx.com');
    assert.equal(getApiBaseUrl('testnet'), 'https://testnet-api.multiversx.com');
    assert.equal(getApiBaseUrl('mainnet'), 'https://api.multiversx.com');
    assert.equal(getApiBaseUrl('production'), 'https://api.multiversx.com');
});

test('parseGuardiansResponse: accepts array response', () => {
    const out = parseGuardiansResponse([
        { sender: 'erd1a', timestamp: 1, txHash: 'hash1', value: '5' },
        { sender: '', timestamp: 2, txHash: 'hash2', value: '5' }, // filtered
    ]);

    assert.deepEqual(out, [{ address: 'erd1a', timestamp: 1, txHash: 'hash1', value: '5' }]);
});

test('parseGuardiansResponse: accepts {data:[...]} response', () => {
    const out = parseGuardiansResponse({
        data: [{ from: 'erd1b', timestamp: 3, hash: 'hash3', value: '7' }],
    });

    assert.deepEqual(out, [{ address: 'erd1b', timestamp: 3, txHash: 'hash3', value: '7' }]);
});

