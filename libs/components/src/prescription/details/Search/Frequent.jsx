import { useEffect } from 'react';
import styles from './Frequent.module.scss';

import { useGetFrequentItems } from '@paziresh24/hooks/prescription';
import isEmpty from 'lodash/isEmpty';
import SearchItem from '../../search/searchItem';

const Frequent = ({
    type,
    typeId,
    insuranceType,
    selectHover,
    setSelectItem,
    onClose,
    ...props
}) => {
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

    useEffect(() => {
        getFrequentItems.isSuccess && props.setResults && props.setResults(getFrequentItems.data);
    }, [getFrequentItems.status]);

    return (
        getFrequentItems.isSuccess &&
        !isEmpty(getFrequentItems.data) && (
            <div>
                <div className={styles.head}>
                    <span>پراستفاده ها</span>
                </div>
                {getFrequentItems.isSuccess &&
                    getFrequentItems.data.map((item, i) =>
                        insuranceType === 'tamin' ? (
                            <SearchItem
                                key={item.id}
                                id={item.id}
                                title={item.service.name}
                                onClose={onClose}
                                setSelectItem={setSelectItem}
                                count={item?.default_count ?? null}
                                use_time={item?.default_use_time ?? null}
                                brands={item?.brands ?? []}
                                default={item?.default ?? []}
                                selectHoverId={i}
                                selectHover={selectHover}
                                serviceCode={item.wsSrvCode}
                                serviceType={item.serviceType}
                            />
                        ) : (
                            <SearchItem
                                key={item.id}
                                id={item.id}
                                title={item.service.name}
                                onClose={onClose}
                                setSelectItem={setSelectItem}
                                shape={item?.service.shape ?? null}
                                selectHoverId={i}
                                selectHover={selectHover}
                                serviceCode={item.nationalNumber}
                                serviceType={item.serviceType}
                            />
                        )
                    )}
            </div>
        )
    );
};

export default Frequent;
