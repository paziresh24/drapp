import { createContext, useContext, useMemo, useState } from 'react';
import { GETـPRESCRIPTIONـTOKEN } from 'utils/services/prescription/localstorage';

const TokenContext = createContext();

const useToken = () => {
    const context = useContext(TokenContext);
    if (!context) {
        throw new Error(`useToken must be used within a TokenProvider`);
    }

    return context;
};

function TokenProvider(props) {
    const [token, setToken] = useState(GETـPRESCRIPTIONـTOKEN() ?? null);
    const value = useMemo(() => [token, setToken], [token]);
    return <TokenContext.Provider value={value} {...props} />;
}

export { useToken, TokenProvider };
