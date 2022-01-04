import { createContext, useContext, useMemo, useState } from 'react';
import { isDesktop } from 'react-device-detect';

const ToolBoxContext = createContext();

const useToolBox = () => {
    const context = useContext(ToolBoxContext);
    if (!context) {
        throw new Error(`useMenu must be used within a ToolBoxContext`);
    }

    return context;
};

const ToolBoxProvider = props => {
    const [isOpen, setOpen] = useState();

    const value = useMemo(() => [isOpen, setOpen], [isOpen]);
    return <ToolBoxContext.Provider value={value} {...props} />;
};

export { useToolBox, ToolBoxProvider };
