import { createContext, useContext, useMemo, useState } from 'react';

const ServicesContext = createContext();

const useServices = () => {
    const context = useContext(ServicesContext);
    if (!context) {
        throw new Error(`useServices must be used within a ServicesProvider`);
    }

    return context;
};

function ServicesProvider(props) {
    const [services, setServices] = useState([]);
    const value = useMemo(() => [services, setServices], [services]);
    return <ServicesContext.Provider value={value} {...props} />;
}

export { useServices, ServicesProvider };
