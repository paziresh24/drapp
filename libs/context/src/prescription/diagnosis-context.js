import { createContext, useContext, useMemo, useState } from 'react';

const DiagnosisContext = createContext();

const useDiagnosis = () => {
    const context = useContext(DiagnosisContext);
    if (!context) {
        throw new Error(`useDiagnosis must be used within a DiagnosisProvider`);
    }

    return context;
};

function DiagnosisProvider(props) {
    const [diagnosis, setDiagnosis] = useState('');
    const value = useMemo(() => [diagnosis, setDiagnosis], [diagnosis]);
    return <DiagnosisContext.Provider value={value} {...props} />;
}

export { useDiagnosis, DiagnosisProvider };
