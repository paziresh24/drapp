import { useEffect } from 'react';
import styles from './Frequent.module.scss';

import { useGetFrequentItems } from '@paziresh24/hooks/prescription';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { extractTypeFromName, translateType } from '@paziresh24/utils';
import isEmpty from 'lodash/isEmpty';

const Frequent = ({ type, typeId, insuranceType, ...props }) => {
    const getFrequentItems = useGetFrequentItems({
        provider: insuranceType,
        ...(type === 'drugs' && {
            serviceType: insuranceType === 'tamin' ? 79 : 1
        }),
        ...(type === 'lab' && {
            serviceType_in: insuranceType === 'tamin' ? 80 : 2
        }),
        ...(type === 'imaging' && {
            serviceType_in: insuranceType === 'tamin' ? typeId : 3
        }),
        ...(type === 'others' && {
            serviceType_nin: insuranceType === 'tamin' ? [79, 80] : [1, 2]
        })
    });

    useEffect(() => {
        getFrequentItems.refetch();
    }, []);

    const addItem = item => {
        props.setSelectItem({
            id: item.service.id,
            name: item.service.name,
            defaultValue: {
                count: item.default?.count ?? props.count ?? null,
                use_time: item.default?.use_time ?? props.use_time?.id ?? null,
                use_instruction: item.default?.use_instruction ?? null,
                how_to_use: item.default?.how_to_use ?? null,
                brand: item.default?.brand ?? null,
                description: item.default?.description ?? null
            },
            shape: item.service.shape ?? null,
            serviceType: item.serviceType,
            isServicesOfDoctors: item.serviceType.id === 5
        });
        props.onClose(false);
    };

    return (
        getFrequentItems.isSuccess &&
        !isEmpty(getFrequentItems.data) && (
            <div>
                <div className={styles.head}>
                    <span>پراستفاده ها</span>
                </div>
                {getFrequentItems.isSuccess &&
                    getFrequentItems.data.map(item => (
                        <div
                            key={item.id}
                            className={styles.wrapper}
                            onMouseDown={() => addItem(item)}
                            aria-hidden
                        >
                            <div
                                className={`${styles.title} ${
                                    +item.serviceType.id === 79 || +item.serviceType.id === 1
                                        ? styles.ltr
                                        : ''
                                }`}
                            >
                                {item.service?.name &&
                                    translateType(extractTypeFromName(item.service?.name)) && (
                                        <span className={styles['type']}>
                                            {translateType(extractTypeFromName(item.service?.name))}
                                        </span>
                                    )}
                                <span>{item.service?.name}</span>
                            </div>
                        </div>
                    ))}
            </div>
        )
    );
};

export default Frequent;
