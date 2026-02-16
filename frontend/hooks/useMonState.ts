
import { useCallback, useEffect, useState } from 'react';

import { MonData } from '../types';

export function useMonState() {
    const [monData, setMonData] = useState<MonData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchState = useCallback(async (opts?: { markLoading?: boolean }) => {
        try {
            if (opts?.markLoading) setIsLoading(true);
            setError(null);

            const res = await fetch('/api/state', { cache: 'no-store' });
            if (!res.ok) {
                const text = await res.text().catch(() => '');
                throw new Error(text || `State API failed (${res.status})`);
            }

            const data = (await res.json()) as {
                state: MonData['state'];
                lastFedTimestamp: number;
                totalFeeds: number;
            };

            setMonData({
                state: data.state,
                lastFedTimestamp: Number(data.lastFedTimestamp) || 0,
                totalFeeds: Number(data.totalFeeds) || 0,
            });
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg);
            console.error('Error fetching mon state:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchState({ markLoading: true });

        const interval = setInterval(() => fetchState(), 20_000); // 20s poll
        const onFocus = () => fetchState();
        const onFed = () => fetchState();

        window.addEventListener('focus', onFocus);
        window.addEventListener('vita:fed', onFed);

        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', onFocus);
            window.removeEventListener('vita:fed', onFed);
        };
    }, [fetchState]);

    return { monData, isLoading, error, refresh: () => fetchState({ markLoading: true }) };
}
