import create from 'zustand';

interface ConsultActivationStore {
    whatsapp: string;
    price: number;
    duration: number;
    workHours: Day[];
    setWhatsapp: (whatsapp: string) => void;
    setPrice: (price: number) => void;
    setDuration: (service_length: number) => void;
    addWorkHours: (workHour: Day[]) => void;
    setWorkHours: (workHours: Day[]) => void;
    removeWorkHours: ({ days, from, to }: DaysInSameTime) => void;
}

export const useConsultActivationStore = create<ConsultActivationStore>(set => ({
    whatsapp: '',
    price: 0,
    duration: 2,
    workHours: [],
    setWhatsapp: whatsapp => set(state => ({ ...state, whatsapp })),
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
