import { createContext, useContext, useMemo, useState } from 'react';

const SubMenuContext = createContext();

const useSubMenu = () => {
    const context = useContext(SubMenuContext);
    if (!context) {
        throw new Error(`useMenu must be used within a SubMenuContext`);
    }

    return context;
};

const SubMenuProvider = props => {
    const [isOpen, setOpen] = useState(false);

    const value = useMemo(() => [isOpen, setOpen], [isOpen]);
    return <SubMenuContext.Provider value={value} {...props} />;
};

export { useSubMenu, SubMenuProvider };
