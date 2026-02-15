
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
import { sendTransactions } from '@multiversx/sdk-dapp/services';
import { refreshAccount } from '@multiversx/sdk-dapp/utils';
import { contractAddress } from '../config';

export default function FeedButton() {
    const { address } = useGetAccountInfo();

    const handleFeed = async () => {
        if (!address) return;

        try {
            await sendTransactions({
                transactions: [
                    {
                        value: '5000000000000000', // 0.005 EGLD
                        data: 'feed',
                        receiver: contractAddress,
                        gasLimit: '5000000'
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
        } catch (error) {
            console.error('Failed to feed:', error);
        }
    };

    return (
        <button
            onClick={handleFeed}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition hover:scale-105 active:scale-95"
        >
            KEEP ALIVE (0.005 EGLD)
        </button>
    );
}
