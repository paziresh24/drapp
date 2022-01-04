import { createContext, useContext, useMemo, useState } from 'react';

const PageContext = createContext();

const usePage = () => {
    const context = useContext(PageContext);
    if (!context) {
        throw new Error(`useMenu must be used within a PageContext`);
    }

    return context;
};

const PageProvider = props => {
    const [isOpen, setOpen] = useState(false);

    const value = useMemo(() => [isOpen, setOpen], [isOpen]);
    return <PageContext.Provider value={value} {...props} />;
};

export { usePage, PageProvider };
