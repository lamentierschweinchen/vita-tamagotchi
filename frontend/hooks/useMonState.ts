
import { useEffect, useState } from 'react';
import { ProxyNetworkProvider } from '@multiversx/sdk-network-providers';
import { SmartContract, Address, ContractFunction, ResultsParser } from '@multiversx/sdk-core';
import { contractAddress, environment } from '../config';
import { MonState, MonData } from '../types';

// Devnet API
const networkProvider = new ProxyNetworkProvider('https://devnet-api.multiversx.com');

export function useMonState() {
    const [monData, setMonData] = useState<MonData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchState = async () => {
        try {
            const contract = new SmartContract({ address: new Address(contractAddress) });

            // Query getMonState
            const queryState = contract.createQuery({
                func: new ContractFunction('getMonState'),
            });
            const queryResponseState = await networkProvider.queryContract(queryState);
            const endpointDefinitionState = contract.getEndpoint('getMonState');
            const { firstValue: stateEnum } = new ResultsParser().parseQueryResponse(queryResponseState, endpointDefinitionState);

            // Query lastFedTimestamp
            const queryTime = contract.createQuery({
                func: new ContractFunction('getLastFedTimestamp'),
            });
            const queryResponseTime = await networkProvider.queryContract(queryTime);
            const endpointDefinitionTime = contract.getEndpoint('getLastFedTimestamp');
            const { firstValue: lastFed } = new ResultsParser().parseQueryResponse(queryResponseTime, endpointDefinitionTime);

            // Query totalFeeds
            const queryFeeds = contract.createQuery({
                func: new ContractFunction('getTotalFeeds'),
            });
            const queryResponseFeeds = await networkProvider.queryContract(queryFeeds);
            const endpointDefinitionFeeds = contract.getEndpoint('getTotalFeeds');
            const { firstValue: totalFeeds } = new ResultsParser().parseQueryResponse(queryResponseFeeds, endpointDefinitionFeeds);

            setMonData({
                state: (stateEnum?.valueOf() as unknown as MonState) || MonState.Happy,
                lastFedTimestamp: (lastFed?.valueOf() as number) || 0,
                totalFeeds: (totalFeeds?.valueOf() as number) || 0,
            });
        } catch (err) {
            console.error('Error fetching mon state:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchState();
        const interval = setInterval(fetchState, 5000); // 5s poll
        return () => clearInterval(interval);
    }, []);

    return { monData, isLoading };
}
