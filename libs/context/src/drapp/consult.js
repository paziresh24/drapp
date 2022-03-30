import { createContext, useContext, useMemo, useState } from 'react';

const ConsultContext = createContext();

const useConsult = () => {
    const context = useContext(ConsultContext);
    if (!context) {
        throw new Error(`useConsult must be used within a ConsultContext`);
    }

    return context;
};

const ConsultProvider = props => {
    const [Consult, setConsult] = useState({});

    const value = useMemo(() => [Consult, setConsult], [Consult]);
    return <ConsultContext.Provider value={value} {...props} />;
};

export { useConsult, ConsultProvider };
