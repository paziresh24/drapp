import create from 'zustand';
import { devtools } from 'zustand/middleware';

interface WorkHoursState {
    duration: number;
    workHours: Day[];
    isAnotherProvider: boolean;
    setDuration: (duration: number) => void;
    setWorkHours: (workHours: Day[]) => void;
    addWorkHours: (workHours: Day[]) => void;
    removeWorkHours: ({ days, from, to }: DaysInSameTime) => void;
    setIsAnotherProvider: (isAnotherProvider: boolean) => void;
}

export const useWorkHoursStore = create<WorkHoursState>(
    devtools(set => ({
        duration: 5,
        workHours: [],
        isAnotherProvider: false,
        setDuration: duration => set(state => ({ ...state, duration })),
        addWorkHours: day => set(state => ({ ...state, workHours: [...state.workHours, ...day] })),
        setWorkHours: day => set(state => ({ ...state, workHours: [...day] })),
        removeWorkHours: ({ days, from, to }) =>
            set(state => {
                const workHourClone = [...state.workHours];
                days.forEach(day => {
                    const index = workHourClone.findIndex(
                        workHour =>
                            workHour.day === day && workHour.from === from && workHour.to === to
                    );
                    workHourClone.splice(index, 1);
                });
                return {
                    ...state,
                    workHours: workHourClone
                };
            }),
        setIsAnotherProvider: isAnotherProvider => set(state => ({ ...state, isAnotherProvider }))
    }))
);
