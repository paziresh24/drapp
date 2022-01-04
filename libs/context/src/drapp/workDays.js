import { createContext, useContext, useMemo, useState } from 'react';

const WorkDaysContext = createContext();

const useWorkDays = () => {
    const context = useContext(WorkDaysContext);
    if (!context) {
        throw new Error(`useWorkDays must be used within a WorkDaysContext`);
    }

    return context;
};

const WorkDaysProvider = props => {
    const [workDays, setWorkDays] = useState({});

    const value = useMemo(() => [workDays, setWorkDays], [workDays]);
    return <WorkDaysContext.Provider value={value} {...props} />;
};

export { useWorkDays, WorkDaysProvider };
