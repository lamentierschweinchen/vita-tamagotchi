import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account/useGetAccountInfo';
import { useGetIsLoggedIn } from '@multiversx/sdk-dapp/hooks/account/useGetIsLoggedIn';
import { useGetNetworkConfig } from '@multiversx/sdk-dapp/hooks/useGetNetworkConfig';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils/account/refreshAccount';
import { useState } from 'react';
import { contractAddress } from '../config';

export default function FeedButton() {
    const { address } = useGetAccountInfo();
    const isLoggedIn = useGetIsLoggedIn();
    const { network } = useGetNetworkConfig();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isConnected = Boolean(isLoggedIn && address);
    const isDisabled = !isConnected || isSubmitting;

    const handleFeed = async () => {
        if (!address || isSubmitting) return;

        try {
            setIsSubmitting(true);
            await refreshAccount();

            await sendTransactions({
                transactions: [
                    {
                        value: '5000000000000000', // 0.005 EGLD
                        data: 'feed',
                        receiver: contractAddress,
                        gasLimit: '5000000',
                        chainID: network.chainId
                    }
                ],
                transactionsDisplayInfo: {
                    processingMessage: 'Feeding your Mon...',
                    errorMessage: 'An error has occurred during feeding',
                    successMessage: 'Mon fed successfully'
                },
                redirectAfterSign: false
            });
            console.log('Transaction sent');

            // Hint the UI to refresh reads; actual on-chain finality may lag, so retry a couple times.
            const ping = () => window.dispatchEvent(new Event('vita:fed'));
            setTimeout(ping, 8_000);
            setTimeout(ping, 20_000);
        } catch (error) {
            console.error('Failed to feed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <button
            onClick={handleFeed}
            disabled={isDisabled}
            className={`feed-button ${isDisabled ? 'feed-button--disabled' : ''}`}
        >
            <span className="feed-button__main">
                {isSubmitting ? 'SENDING...' : isConnected ? 'KEEP ALIVE' : 'LOGIN REQUIRED'}
            </span>
            <span className="feed-button__sub">{isConnected ? '0.005 EGLD' : 'Use wallet panel'}</span>
        </button>
    );
}
