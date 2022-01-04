import { createContext, useContext, useMemo, useState } from 'react';

const MeContext = createContext();

const useMe = () => {
    const context = useContext(MeContext);
    if (!context) {
        throw new Error(`useMe must be used within a MeProvider`);
    }

    return context;
};

function MeProvider(props) {
    const [me, setMe] = useState();
    const value = useMemo(() => [me, setMe], [me]);
    return <MeContext.Provider value={value} {...props} />;
}

export { useMe, MeProvider };
