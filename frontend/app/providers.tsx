'use client';

import { DappProvider } from '@multiversx/sdk-dapp/wrappers';
import { SignTransactionsModals } from '@multiversx/sdk-dapp/UI/SignTransactionsModals';
import { TransactionsToastList } from '@multiversx/sdk-dapp/UI/TransactionsToastList';
import { environment } from '../config';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <DappProvider
            environment={environment}
            dappConfig={{ logoutRoute: '/' }}
        >
            <>
                {children}
                <SignTransactionsModals />
                <TransactionsToastList />
            </>
        </DappProvider>
    );
}
