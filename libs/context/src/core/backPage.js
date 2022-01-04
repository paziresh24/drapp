import { createContext, useContext, useMemo, useState } from 'react';

const BackPageContext = createContext();

const useBackPage = () => {
    const context = useContext(BackPageContext);
    if (!context) {
        throw new Error(`useBackPage must be used within a BackPageContext`);
    }

    return context;
};

const BackPageProvider = props => {
    const [backPage, setBackPage] = useState(null);

    const value = useMemo(() => [backPage, setBackPage], [backPage]);
    return <BackPageContext.Provider value={value} {...props} />;
};

export { useBackPage, BackPageProvider };
