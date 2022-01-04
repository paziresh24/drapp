import { createContext, useContext, useMemo, useState } from 'react';

const DurationContext = createContext();

const useDuration = () => {
    const context = useContext(DurationContext);
    if (!context) {
        throw new Error(`useDuration must be used within a DurationContext`);
    }

    return context;
};

const DurationProvider = props => {
    const [duration, setDuration] = useState({});

    const value = useMemo(() => [duration, setDuration], [duration]);
    return <DurationContext.Provider value={value} {...props} />;
};

export { useDuration, DurationProvider };
