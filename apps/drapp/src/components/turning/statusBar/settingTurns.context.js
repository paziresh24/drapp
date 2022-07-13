import { createContext, useContext, useMemo, useState } from 'react';

const SettingTurnsContext = createContext();

const useSettingTurns = () => {
    const context = useContext(SettingTurnsContext);
    if (!context) {
        throw new Error(`useSettingTurns must be used within a SettingTurnsContext`);
    }

    return context;
};

const SettingTurnsProvider = props => {
    const [isOpen, setOpen] = useState(false);

    const value = useMemo(() => [isOpen, setOpen], [isOpen]);
    return <SettingTurnsContext.Provider value={value} {...props} />;
};

export { useSettingTurns, SettingTurnsProvider };
