
import { useEffect, useState } from 'react';

interface LifeBarProps {
    lastFedTimestamp: number;
}

export default function LifeBar({ lastFedTimestamp }: LifeBarProps) {
    const [timeLeft, setTimeLeft] = useState(0);
    const totalDuration = 24 * 3600;

    useEffect(() => {
        const updateTime = () => {
            const now = Math.floor(Date.now() / 1000);
            const elapsed = now - lastFedTimestamp;
            const remaining = Math.max(0, totalDuration - elapsed);
            setTimeLeft(remaining);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [lastFedTimestamp, totalDuration]);

    const percentage = (timeLeft / totalDuration) * 100;

    let color = 'bg-green-500';
    if (percentage < 25) color = 'bg-red-500';
    else if (percentage < 50) color = 'bg-yellow-500';

    return (
        <div className="w-full bg-gray-200 rounded-full h-6 dark:bg-gray-700 mt-4 overflow-hidden">
            <div
                className={`${color} h-6 rounded-full transition-all duration-1000 ease-linear`}
                style={{ width: `${percentage}%` }}
            ></div>
            <div className="text-center text-xs mt-1">
                {Math.floor(timeLeft / 3600)}h {Math.floor((timeLeft % 3600) / 60)}m left
            </div>
        </div>
    );
}
