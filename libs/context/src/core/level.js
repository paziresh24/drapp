import { createContext, useContext, useMemo, useState } from 'react';

const LevelContext = createContext();

const useLevel = () => {
    const context = useContext(LevelContext);
    if (!context) {
        throw new Error(`useLevel must be used within a LevelContext`);
    }

    return context;
};

const LevelProvider = props => {
    const [level, setLevel] = useState('DOCTOR');

    const value = useMemo(() => [level, setLevel], [level]);
    return <LevelContext.Provider value={value} {...props} />;
};

export { useLevel, LevelProvider };
