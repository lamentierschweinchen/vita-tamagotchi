
import { useCallback, useEffect, useState } from 'react';

interface Guardian {
    address: string;
    timestamp: number;
    txHash: string;
    value: string;
}

export function useLastGuardians() {
    const [guardians, setGuardians] = useState<Guardian[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchGuardians = useCallback(async (opts?: { markLoading?: boolean }) => {
        try {
            if (opts?.markLoading) setIsLoading(true);
            setError(null);

            const res = await fetch('/api/guardians?limit=10', { cache: 'no-store' });
            if (!res.ok) {
                const text = await res.text().catch(() => '');
                throw new Error(text || `Guardians API failed (${res.status})`);
            }

            const data = (await res.json()) as { guardians: Guardian[] };
            setGuardians(Array.isArray(data.guardians) ? data.guardians : []);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg);
            console.error('Error fetching guardians:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGuardians({ markLoading: true });

        const interval = setInterval(() => fetchGuardians(), 60_000); // 60s poll
        const onFocus = () => fetchGuardians();
        const onFed = () => fetchGuardians();

        window.addEventListener('focus', onFocus);
        window.addEventListener('vita:fed', onFed);

        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', onFocus);
            window.removeEventListener('vita:fed', onFed);
        };
    }, [fetchGuardians]);

    return { guardians, isLoading, error, refresh: () => fetchGuardians({ markLoading: true }) };
}
