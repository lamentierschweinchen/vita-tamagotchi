
import { useEffect, useState } from 'react';
import axios from 'axios';
import { contractAddress, environment } from '../config';

interface Guardian {
    address: string;
    timestamp: number;
    txHash: string;
    value: string;
}

const API_URL = environment === 'devnet'
    ? 'https://devnet-api.multiversx.com'
    : 'https://api.multiversx.com';

export function useLastGuardians() {
    const [guardians, setGuardians] = useState<Guardian[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchGuardians = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/accounts/${contractAddress}/transactions`, {
                params: {
                    function: 'feed',
                    status: 'success',
                    size: 10,
                    order: 'desc' // Latest first
                }
            });

            const mapped = data.map((tx: { sender: string; timestamp: number; txHash: string; value: string }) => ({
                address: tx.sender,
                timestamp: tx.timestamp,
                txHash: tx.txHash,
                value: tx.value,
            }));

            setGuardians(mapped);
        } catch (err) {
            console.error('Error fetching guardians:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchGuardians();
        const interval = setInterval(fetchGuardians, 10000); // 10s poll
        return () => clearInterval(interval);
    }, []);

    return { guardians, isLoading };
}
