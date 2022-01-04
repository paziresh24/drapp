import { createContext, useContext, useMemo, useState } from 'react';
import { isDesktop } from 'react-device-detect';

const MenuContext = createContext();

const useMenu = () => {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error(`useMenu must be used within a MenuContext`);
    }

    return context;
};

const MenuProvider = props => {
    const [isOpen, setOpen] = useState(false);

    const value = useMemo(() => [isOpen, setOpen], [isOpen]);
    return <MenuContext.Provider value={value} {...props} />;
};

export { useMenu, MenuProvider };
