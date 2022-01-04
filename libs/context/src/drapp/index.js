import { createContext, useContext, useMemo, useState } from 'react';

const DrAppContext = createContext();

const useDrApp = () => {
    const context = useContext(DrAppContext);
    if (!context) {
        throw new Error(`useDrApp must be used within a DrAppContext`);
    }

    return context;
};

const DrAppProvider = props => {
    const [info, setInfo] = useState('');

    const value = useMemo(() => [info, setInfo], [info]);
    return <DrAppContext.Provider value={value} {...props} />;
};

export { useDrApp, DrAppProvider };
