import { MonState } from '../types';

interface MonDisplayProps {
    state: MonState;
}

const stateEmojis: Record<MonState, string> = {
    [MonState.Happy]: '🐣',
    [MonState.Hungry]: '🍗',
    [MonState.Critical]: '⚠️',
    [MonState.Dead]: '🪦',
};

const stateColors: Record<MonState, string> = {
    [MonState.Happy]: 'bg-green-100 text-green-800',
    [MonState.Hungry]: 'bg-yellow-100 text-yellow-800',
    [MonState.Critical]: 'bg-red-100 text-red-800',
    [MonState.Dead]: 'bg-gray-100 text-gray-800',
};

export default function MonDisplay({ state }: MonDisplayProps) {
    return (
        <div className={`p-10 rounded-full text-9xl ${stateColors[state]} transition-all duration-500`}>
            {stateEmojis[state]}
        </div>
    );
}
