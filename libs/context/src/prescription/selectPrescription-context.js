import { createContext, useContext, useMemo, useState } from 'react';

const MeSelectPrescriptionContext = createContext();

const useSelectPrescription = () => {
    const context = useContext(MeSelectPrescriptionContext);
    if (!context) {
        throw new Error(`useSelectPrescription must be used within a SelectPrescriptionProvider`);
    }

    return context;
};

function SelectPrescriptionProvider(props) {
    const [selectPrescription, setSelectPrescription] = useState();
    const value = useMemo(() => [selectPrescription, setSelectPrescription], [selectPrescription]);
    return <MeSelectPrescriptionContext.Provider value={value} {...props} />;
}

export { useSelectPrescription, SelectPrescriptionProvider };
