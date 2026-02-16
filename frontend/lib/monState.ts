import { MonState } from '../types';

const SIX_HOURS = 6 * 60 * 60;
const EIGHTEEN_HOURS = 18 * 60 * 60;
const TWENTY_FOUR_HOURS = 24 * 60 * 60;

export function computeMonState(params: { lastFedTimestamp: number; now: number }): MonState {
    const { lastFedTimestamp, now } = params;

    // Mirrors on-chain behavior: if timestamps are weird, default to Happy.
    if (!Number.isFinite(lastFedTimestamp) || !Number.isFinite(now) || now < lastFedTimestamp) {
        return MonState.Happy;
    }

    const elapsed = now - lastFedTimestamp;

    if (elapsed <= SIX_HOURS) return MonState.Happy;
    if (elapsed <= EIGHTEEN_HOURS) return MonState.Hungry;
    if (elapsed <= TWENTY_FOUR_HOURS) return MonState.Critical;
    return MonState.Dead;
}

