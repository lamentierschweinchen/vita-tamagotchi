'use client';

import { useState } from 'react';
import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks/account/useGetAccountInfo';
import { useGetLoginInfo } from '@multiversx/sdk-dapp/hooks/account/useGetLoginInfo';
import { ExtensionLoginButton } from '@multiversx/sdk-dapp/UI/extension/ExtensionLoginButton';
import { WebWalletLoginButton } from '@multiversx/sdk-dapp/UI/webWallet/WebWalletLoginButton';
import { logout } from '@multiversx/sdk-dapp/utils';

function shortAddress(address: string) {
    if (address.length <= 16) return address;
    return `${address.slice(0, 10)}...${address.slice(-6)}`;
}

function prettyLoginMethod(loginMethod: unknown) {
    const value = String(loginMethod || '');
    if (value.toLowerCase().includes('webwallet')) return 'Web Wallet';
    if (value.toLowerCase().includes('extension')) return 'Extension';
    if (value.toLowerCase().includes('ledger')) return 'Ledger';
    if (!value || value === 'none') return 'Unknown';
    return value;
}

export default function WalletPanel() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState<string | null>(null);

    const { address } = useGetAccountInfo();
    const { isLoggedIn, loginMethod } = useGetLoginInfo();
    const isConnected = Boolean(isLoggedIn && address);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            setLogoutError(null);
            await logout('/');
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setLogoutError(message);
        } finally {
            setIsLoggingOut(false);
        }
    };

    if (isConnected) {
        return (
            <section className="wallet-panel wallet-panel--connected" aria-label="Wallet connection">
                <div className="wallet-panel__header">
                    <span className="wallet-chip">Wallet Online</span>
                    <span className="wallet-method">{prettyLoginMethod(loginMethod)}</span>
                </div>

                <div className="wallet-address">{shortAddress(address)}</div>

                <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="wallet-logout-button"
                >
                    {isLoggingOut ? 'Disconnecting...' : 'Disconnect'}
                </button>

                {logoutError ? (
                    <div className="wallet-error">Failed to disconnect: {logoutError}</div>
                ) : null}
            </section>
        );
    }

    return (
        <section className="wallet-panel" aria-label="Wallet login">
            <div className="wallet-panel__header">
                <span className="wallet-chip">Guardian Wallet</span>
                <span className="wallet-method">Choose Provider</span>
            </div>

            <p className="wallet-copy">Connect your wallet to feed the pet and sign transactions.</p>

            <div className="wallet-login-options">
                <ExtensionLoginButton
                    callbackRoute="/"
                    loginButtonText="Connect Extension"
                    buttonClassName="wallet-login-button"
                />
                <WebWalletLoginButton
                    callbackRoute="/"
                    loginButtonText="Connect Web Wallet"
                    buttonClassName="wallet-login-button wallet-login-button--secondary"
                />
            </div>

            <p className="wallet-helper">
                Web Wallet opens a secure tab and returns here after login.
            </p>
        </section>
    );
}
