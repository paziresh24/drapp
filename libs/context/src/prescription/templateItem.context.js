import { createContext, useContext, useMemo, useState } from 'react';

const TemplateItemContext = createContext();

const useTemplateItem = () => {
    const context = useContext(TemplateItemContext);
    if (!context) {
        throw new Error(`useTemplateItem must be used within a TemplateItemContext`);
    }

    return context;
};

function TemplateItemProvider(props) {
    const [templateItem, setTemplateItem] = useState([]);
    const value = useMemo(() => [templateItem, setTemplateItem], [templateItem]);
    return <TemplateItemContext.Provider value={value} {...props} />;
}

export { useTemplateItem, TemplateItemProvider };
