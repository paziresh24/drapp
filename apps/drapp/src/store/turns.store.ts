import create from 'zustand';

interface TurnsState {
    turns: any[];
    setTurns: (turns: any[]) => void;
}

export const useTurnsStore = create<TurnsState>(set => ({
    turns: [],
    setTurns: turns => set(state => ({ ...state, turns }))
}));
