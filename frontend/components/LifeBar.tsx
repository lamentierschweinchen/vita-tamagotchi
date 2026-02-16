
import { useEffect, useState } from 'react';

interface LifeBarProps {
    lastFedTimestamp: number;
}

export default function LifeBar({ lastFedTimestamp }: LifeBarProps) {
    const [timeLeft, setTimeLeft] = useState(0);
    const totalDuration = 24 * 3600;
    const segments = 12;

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
    const litSegments = Math.max(0, Math.min(segments, Math.ceil((percentage / 100) * segments)));

    let level: 'high' | 'mid' | 'low' = 'high';
    if (percentage < 25) level = 'low';
    else if (percentage < 50) level = 'mid';

    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);

    return (
        <section className="life-panel" aria-label="Pet vitality">
            <div className="life-panel__head">
                <span>Vitality</span>
                <span>{hours}h {minutes}m</span>
            </div>

            <div className={`life-segments life-segments--${level}`}>
                {Array.from({ length: segments }).map((_, index) => (
                    <span
                        key={index}
                        className={`life-segment ${index < litSegments ? 'life-segment--filled' : ''}`}
                    />
                ))}
            </div>
        </section>
    );
}
