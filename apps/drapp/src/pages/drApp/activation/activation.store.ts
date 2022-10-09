import create from 'zustand';

interface ActivationStore {
    selectedService: ServicesType[];
    setSelectedService: (fn: (prev: ServicesType[]) => ServicesType[]) => void;
}

export const useActivationStore = create<ActivationStore>(set => ({
    selectedService: [],
    setSelectedService: fn => {
        return set(state => ({ ...state, selectedService: fn(state.selectedService) }));
    }
}));
