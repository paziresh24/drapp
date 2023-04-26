import create from 'zustand';

type Messenger = {
    type: string;
    channel: string;
};

interface ConsultActivationStore {
    visitChannel: Messenger[];
    price: number;
    duration: number;
    workHours: Day[];
    setMessenger: (visitChannel: Messenger[]) => void;
    setPrice: (price: number) => void;
    setDuration: (service_length: number) => void;
    addWorkHours: (workHour: Day[]) => void;
    setWorkHours: (workHours: Day[]) => void;
    removeWorkHours: ({ days, from, to }: DaysInSameTime) => void;
}

export const useConsultActivationStore = create<ConsultActivationStore>(set => ({
    visitChannel: [],
    price: 0,
    duration: 2,
    workHours: [],
    setMessenger: visitChannel => set(state => ({ ...state, visitChannel })),
    setPrice: price => set(state => ({ ...state, price })),
    setDuration: duration => set(state => ({ ...state, duration })),
    setWorkHours: workHours => set(state => ({ ...state, workHours })),
    addWorkHours: workHour =>
        set(state => ({
            ...state,
            workHours: [...state.workHours, ...workHour]
        })),
    removeWorkHours: ({ days, from, to }) =>
        set(state => {
            const workHourClone = [...state.workHours];
            days.forEach(day => {
                const index = workHourClone.findIndex(
                    workHour => workHour.day === day && workHour.from === from && workHour.to === to
                );
                workHourClone.splice(index, 1);
            });
            return {
                ...state,
                workHours: workHourClone
            };
        })
}));
