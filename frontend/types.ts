export enum MonState {
    Happy = 'Happy',
    Hungry = 'Hungry',
    Critical = 'Critical',
    Dead = 'Dead',
}

export interface MonData {
    state: MonState;
    lastFedTimestamp: number;
    totalFeeds: number;
}
