import { MonState } from '../types';
import PixelPet from './PixelPet';

interface MonDisplayProps {
    state: MonState;
}

const stateLabels: Record<MonState, { title: string; message: string }> = {
    [MonState.Happy]: {
        title: 'Blooming',
        message: 'Your pocket buddy is playful and bright.',
    },
    [MonState.Hungry]: {
        title: 'Peckish',
        message: 'Energy dip detected. A feed will perk it up.',
    },
    [MonState.Critical]: {
        title: 'Distress',
        message: 'Urgent care required. Keep the life signal alive.',
    },
    [MonState.Dead]: {
        title: 'Faded',
        message: 'Signal lost. This season has ended.',
    },
};

const stateToneClass: Record<MonState, string> = {
    [MonState.Happy]: 'lcd-status--happy',
    [MonState.Hungry]: 'lcd-status--hungry',
    [MonState.Critical]: 'lcd-status--critical',
    [MonState.Dead]: 'lcd-status--dead',
};

export default function MonDisplay({ state }: MonDisplayProps) {
    const label = stateLabels[state];

    return (
        <section className={`lcd-screen ${stateToneClass[state]}`} aria-label="Pet status display">
            <div className="lcd-screen__scanline" />
            <div className="lcd-screen__sun" />
            <div className="lcd-screen__cloud lcd-screen__cloud--left" />
            <div className="lcd-screen__cloud lcd-screen__cloud--right" />
            <div className="lcd-screen__ground" />
            <div className="lcd-screen__pet">
                <PixelPet state={state} />
            </div>

            <div className="lcd-screen__meta">
                <div className="lcd-status">{label.title}</div>
                <p className="lcd-screen__caption">{label.message}</p>
            </div>
        </section>
    );
}
