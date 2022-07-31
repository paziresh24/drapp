import create from 'zustand';

type Statistics = {
    total: number;
    activePatients: number;
    visitedPatients: number;
};

interface TurnsState {
    turns: any[];
    statistics: Statistics;
    setTurns: (turns: any[]) => void;
    setStatistics: (statistics: Statistics) => void;
}

export const useTurnsStore = create<TurnsState>(set => ({
    turns: [],
    statistics: {
        total: 0,
        activePatients: 0,
        visitedPatients: 0
    },
    setTurns: turns => set(state => ({ ...state, turns })),
    setStatistics: statistics => set(state => ({ ...state, statistics }))
}));
