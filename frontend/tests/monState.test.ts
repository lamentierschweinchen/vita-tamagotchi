import assert from 'node:assert/strict';
import test from 'node:test';

import { computeMonState } from '../lib/monState';
import { MonState } from '../types';

test('computeMonState: boundaries match on-chain logic', () => {
    const lastFed = 1_000;

    assert.equal(computeMonState({ lastFedTimestamp: lastFed, now: lastFed }), MonState.Happy);

    // 6h boundary is still Happy.
    assert.equal(computeMonState({ lastFedTimestamp: lastFed, now: lastFed + 6 * 3600 }), MonState.Happy);
    assert.equal(computeMonState({ lastFedTimestamp: lastFed, now: lastFed + 6 * 3600 + 1 }), MonState.Hungry);

    // 18h boundary is still Hungry.
    assert.equal(computeMonState({ lastFedTimestamp: lastFed, now: lastFed + 18 * 3600 }), MonState.Hungry);
    assert.equal(computeMonState({ lastFedTimestamp: lastFed, now: lastFed + 18 * 3600 + 1 }), MonState.Critical);

    // 24h boundary is still Critical.
    assert.equal(computeMonState({ lastFedTimestamp: lastFed, now: lastFed + 24 * 3600 }), MonState.Critical);
    assert.equal(computeMonState({ lastFedTimestamp: lastFed, now: lastFed + 24 * 3600 + 1 }), MonState.Dead);
});

test('computeMonState: weird timestamps default to Happy', () => {
    assert.equal(computeMonState({ lastFedTimestamp: 100, now: 99 }), MonState.Happy);
    assert.equal(computeMonState({ lastFedTimestamp: Number.NaN, now: 100 }), MonState.Happy);
});

