'use client';

import { useMonState } from '../hooks/useMonState';
import { useLastGuardians } from '../hooks/useLastGuardians';
import MonDisplay from '../components/MonDisplay';
import LifeBar from '../components/LifeBar';
import FeedButton from '../components/FeedButton';
import ClientOnly from '../components/ClientOnly';
import RetroContainer from '../components/RetroContainer';

export default function Home() {
  const { monData, isLoading } = useMonState();
  const { guardians } = useLastGuardians();

  if (isLoading || !monData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-pulse text-2xl">Hatching...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono">
      <h1 className="text-4xl font-bold mb-8">VITA Tamagotchi</h1>

      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl flex flex-col items-center">
        <ClientOnly>
          <MonDisplay state={monData.state} />
        </ClientOnly>

        <div className="mt-8 w-full">
          <div className="flex justify-between mb-2 text-sm font-semibold">
            <span>Status: {monData.state}</span>
            <span>Feeds: {monData.totalFeeds}</span>
          </div>

          <LifeBar lastFedTimestamp={monData.lastFedTimestamp} />
        </div>

        <div className="mt-10">
          <FeedButton />
        </div>
      </div>

      <div className="mt-12 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Last Guardians</h2>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow h-40 overflow-y-auto">
          {guardians.length === 0 ? (
            <div className="text-sm p-2 text-gray-500 italic">No guardians yet... be the first!</div>
          ) : (
            guardians.map((g, i) => (
              <div key={i} className="text-sm p-2 border-b dark:border-gray-700 font-mono">
                {g.address.substring(0, 10)}... - 0.005 EGLD
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
