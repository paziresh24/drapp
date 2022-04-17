import { useRef, useState, useEffect } from 'react';
import {
    useImportStatus,
    useGetFavoriteServices,
    useGetFavoritePrescriptions
} from '@paziresh24/hooks/prescription';
import Import from '../Import';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import SalamatImport from '../Import/salamat';

const ImportStatus = ({ type, isOpenImportModal, setIsOpenImportModal }) => {
    const [prescriptionInfo] = useSelectPrescription();
    const importStatus = useImportStatus({
        provider: prescriptionInfo?.insuranceType,
        _sort: 'created_at:DESC'
    });
    const [statusImport, setStatusImport] = useState();
    let importInterval = useRef(null);
    const getFavoriteServices = useGetFavoriteServices({
        provider: prescriptionInfo?.insuranceType,
        _limit: 1000
    });

    const getFavoritePrescriptions = useGetFavoritePrescriptions({
        [prescriptionInfo.insuranceType + 'Items_null']: false
    });

    useEffect(() => {
        importStatus.refetch();
    }, []);

    useEffect(() => {
        return () => {
            clearInterval(importInterval.current);
            importInterval.current = null;
        };
    }, []);

    useEffect(() => {
        if (importStatus.isSuccess) {
            const status = importStatus.data.filter(item => item.type === type)?.[0]?.status;
            setStatusImport(status);

            if (status === 'SUCCESS' && importInterval.current !== null) {
                getFavoriteServices.refetch();
                getFavoritePrescriptions.refetch();
                importStatus.remove();
            }

            if (status === 'SUBMITTED') {
                if (importInterval.current === null) {
                    importInterval.current = setInterval(() => {
                        importStatus.remove();
                        importStatus.refetch();
                    }, 1500);
                }
            } else {
                clearInterval(importInterval.current);
                importInterval.current = null;
            }
        }
    }, [importStatus.status]);
    return (
        <>
            {prescriptionInfo.insuranceType === 'salamat' && (
                <SalamatImport isOpen={isOpenImportModal} onClose={setIsOpenImportModal} />
            )}
            {prescriptionInfo.insuranceType === 'tamin' && (
                <Import isOpen={isOpenImportModal} onClose={setIsOpenImportModal} />
            )}
        </>
    );
};

export default ImportStatus;
