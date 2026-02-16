'use client';

import { useMonState } from '../hooks/useMonState';
import { useLastGuardians } from '../hooks/useLastGuardians';
import MonDisplay from '../components/MonDisplay';
import LifeBar from '../components/LifeBar';
import FeedButton from '../components/FeedButton';
import WalletPanel from '../components/WalletPanel';

function shortAddress(address: string) {
  if (address.length <= 14) return address;
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}

function formatElapsed(timestamp: number) {
  const seconds = Math.max(0, Math.floor(Date.now() / 1000) - timestamp);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function formatEgld(raw: string) {
  try {
    const amount = BigInt(raw);
    const base = 10n ** 18n;
    const whole = amount / base;
    const fraction = (amount % base).toString().padStart(18, '0').slice(0, 3).replace(/0+$/, '');
    return fraction ? `${whole}.${fraction}` : whole.toString();
  } catch {
    return '0.005';
  }
}

export default function Home() {
  const { monData, isLoading, error: stateError, refresh: refreshState } = useMonState();
  const { guardians, isLoading: guardiansLoading, error: guardiansError, refresh: refreshGuardians } = useLastGuardians();

  const refreshAll = () => {
    refreshState();
    refreshGuardians();
  };

  if (isLoading && !monData) {
    return (
      <main className="tama-page">
        <section className="tama-device">
          <header className="tama-device__header">
            <p className="tama-brand">VITA MON</p>
            <h1>Pocket Guardian Terminal</h1>
          </header>

          <div className="boot-screen">
            <p className="boot-screen__title">BOOTING PETCORE...</p>
            <div className="boot-screen__progress">
              <span />
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (!monData) {
    return (
      <main className="tama-page">
        <section className="tama-device">
          <header className="tama-device__header">
            <p className="tama-brand">VITA MON</p>
            <h1>Pocket Guardian Terminal</h1>
          </header>

          <div className="system-error">
            <h2>NO PET SIGNAL</h2>
            <p>{stateError || 'Failed to load on-chain state.'}</p>
            <button className="sync-button" onClick={refreshAll}>Retry Sync</button>
          </div>
        </section>
      </main>
    );
  }

  const lastFedAt = monData.lastFedTimestamp > 0
    ? new Date(monData.lastFedTimestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  return (
    <main className="tama-page">
      <section className="tama-device">
        <header className="tama-device__header">
          <p className="tama-brand">VITA MON</p>
          <h1>Pocket Guardian Terminal</h1>
          <p className="tama-subtitle">Community life support on MultiversX devnet</p>
        </header>

        {stateError ? (
          <div className="system-warning">
            <strong>STATE SYNC DELAYED</strong>
            <span>{stateError}</span>
          </div>
        ) : null}

        <MonDisplay state={monData.state} />

        <div className="tama-readouts">
          <div className="readout">
            <span>Condition</span>
            <strong>{monData.state}</strong>
          </div>
          <div className="readout">
            <span>Total Feeds</span>
            <strong>{monData.totalFeeds}</strong>
          </div>
          <div className="readout">
            <span>Last Feed</span>
            <strong>{lastFedAt}</strong>
          </div>
        </div>

        <LifeBar lastFedTimestamp={monData.lastFedTimestamp} />

        <WalletPanel />

        <div className="tama-actions">
          <FeedButton />
          <button className="sync-button" onClick={refreshAll}>SYNC NOW</button>
        </div>
      </section>

      <section className="guardian-console">
        <div className="guardian-console__header">
          <h2>Guardian Log</h2>
          <button onClick={refreshAll}>Refresh</button>
        </div>

        {guardiansError ? (
          <div className="guardian-console__notice">
            Unable to load guardians: {guardiansError}
          </div>
        ) : guardiansLoading && guardians.length === 0 ? (
          <div className="guardian-console__notice">Syncing guardian entries...</div>
        ) : guardians.length === 0 ? (
          <div className="guardian-console__notice">No guardians yet. Be the first to feed.</div>
        ) : (
          <ul className="guardian-list">
            {guardians.map((guardian) => (
              <li key={guardian.txHash} className="guardian-list__item">
                <span>{shortAddress(guardian.address)}</span>
                <span>{formatElapsed(guardian.timestamp)}</span>
                <span>{formatEgld(guardian.value)} EGLD</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
