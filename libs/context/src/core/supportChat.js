import { createContext, useContext, useMemo, useState } from 'react';

const SupportContext = createContext();

const useSupport = () => {
    const context = useContext(SupportContext);
    if (!context) {
        throw new Error(`useSupport must be used within a SupportContext`);
    }

    return context;
};

const SupportProvider = props => {
    const [isOpen, setOpen] = useState(false);

    const value = useMemo(() => [isOpen, setOpen], [isOpen]);
    return <SupportContext.Provider value={value} {...props} />;
};

export { useSupport, SupportProvider };
