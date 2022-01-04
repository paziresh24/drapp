import { createContext, useContext, useMemo, useState } from 'react';

const SelectTypesContext = createContext();

const useSelectType = () => {
    const context = useContext(SelectTypesContext);
    if (!context) {
        throw new Error(`useSelectType must be used within a SelectTypeProvider`);
    }

    return context;
};

function SelectTypeProvider(props) {
    const [selectType, setSelectType] = useState('drugs');
    const value = useMemo(() => [selectType, setSelectType], [selectType]);
    return <SelectTypesContext.Provider value={value} {...props} />;
}

export { useSelectType, SelectTypeProvider };
