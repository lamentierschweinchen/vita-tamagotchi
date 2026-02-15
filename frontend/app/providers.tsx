'use client';

import { DappProvider } from '@multiversx/sdk-dapp/wrappers';
import { environment } from '../config';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <DappProvider
            environment={environment}
            customNetworkConfig={{
                name: 'customConfig',
                walletConnectV2ProjectId: 'project-id', // Placeholder
            }}
        >
            {children}
        </DappProvider>
    );
}
