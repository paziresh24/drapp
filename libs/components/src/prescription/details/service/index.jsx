import styles from './service.module.scss';

import DrugDetails from '../serviceDetails/details/Drugs';
import OthersDetails from '../serviceDetails/details/Others';

import { useLayoutEffect } from 'react';
import LabsDetails from './../serviceDetails/details/Labs';
import { useSelectType } from '@paziresh24/context/prescription/selectType-context';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import ImagingDetails from './../serviceDetails/details/Imaging';
import { useServices } from '@paziresh24/context/prescription/services-context';

const Service = ({ type }) => {
    const [prescriptionInfo] = useSelectPrescription();
    const [services, setServices] = useServices();
    const [, setType] = useSelectType();

    useLayoutEffect(() => {
        setType(type);
    }, [setType, type]);

    return (
        <div className={styles.wrapper}>
            {(!prescriptionInfo.finalized || prescriptionInfo.insuranceType === 'salamat') && (
                <>
                    {type === 'drugs' && (
                        <DrugDetails
                            services={services}
                            setServices={setServices}
                            insuranceType={prescriptionInfo.insuranceType}
                        />
                    )}
                    {type === 'lab' && (
                        <LabsDetails
                            services={services}
                            setServices={setServices}
                            insuranceType={prescriptionInfo.insuranceType}
                        />
                    )}
                    {type === 'imaging' && (
                        <ImagingDetails
                            services={services}
                            setServices={setServices}
                            insuranceType={prescriptionInfo.insuranceType}
                        />
                    )}
                    {type === 'others' && (
                        <OthersDetails
                            services={services}
                            setServices={setServices}
                            insuranceType={prescriptionInfo.insuranceType}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Service;
