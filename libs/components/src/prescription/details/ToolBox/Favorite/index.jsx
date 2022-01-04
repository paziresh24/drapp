import styles from './Favorite.module.scss';
import SearchBar from '../../../search/searchBar';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { useState, useLayoutEffect } from 'react';
import { useGetFavoriteServices } from '@paziresh24/hooks/prescription';
import { useFavoriteItem } from '@paziresh24/context/prescription/favoriteItem.context';
import { Overlay } from '@paziresh24/components/core/overlay';
import { useSelectType } from '@paziresh24/context/prescription/selectType-context';
import Button from '@paziresh24/components/core/button/index';
import { Mobile } from '@paziresh24/hooks/device';
import FixedWrapBottom from '@paziresh24/components/prescription/fixedWrapBottom';
import Item from './item';
import { useServices } from '@paziresh24/context/prescription/services-context';
import { useToolBox } from '@paziresh24/context/prescription/toolBox.context';
import serviceTypeList from '@paziresh24/constants/serviceTypeList.json';
import ImportStatus from '../ImportStatus';

const Favorite = () => {
    const [prescriptionInfo] = useSelectPrescription();
    const [favoriteItem, setFavoriteItem] = useFavoriteItem();
    const [type] = useSelectType();
    const getFavoriteServices = useGetFavoriteServices({
        provider: prescriptionInfo?.insuranceType
    });
    const [favoriteItemByType, setFavoriteItemByType] = useState([]);
    const [searchServiceValue, setSearchServiceValue] = useState('');
    const [favoriteListSelect, setFavoriteListSelect] = useState([]);
    const [, setServices] = useServices();
    const [, setIsOpenToolBox] = useToolBox();

    useLayoutEffect(() => {
        if (getFavoriteServices.isSuccess) {
            setFavoriteItemByType(
                getFavoriteServices.data.filter(item => typeChecker(item.service_type))
            );
        }
    }, [favoriteItem]);

    useLayoutEffect(() => {
        setFavoriteItemByType(favoriteItem.filter(item => typeChecker(item.service_type)));
    }, [favoriteItem, type]);

    const typeChecker = serviceType => {
        if (
            type === 'drugs' &&
            serviceTypeList[type][prescriptionInfo.insuranceType].includes(+serviceType)
        ) {
            return true;
        }
        if (
            type === 'lab' &&
            serviceTypeList[type][prescriptionInfo.insuranceType].includes(+serviceType)
        ) {
            return true;
        }
        if (
            type === 'imaging' &&
            serviceTypeList[type][prescriptionInfo.insuranceType].includes(+serviceType)
        ) {
            return true;
        }
        if (
            type === 'others' &&
            serviceTypeList[type][prescriptionInfo.insuranceType].includes(+serviceType)
        ) {
            return true;
        }
    };

    const addItemList = () => {
        setServices(prev => [...prev, ...favoriteListSelect]);
        setIsOpenToolBox(false);
        setFavoriteListSelect([]);
    };

    return (
        <div className={styles.wrapper}>
            {/* {favoriteItem.length !== 0 && ( */}
            <div className={styles['searchWrapper']}>
                <SearchBar label="جستجوی بین اقلام ..." value={setSearchServiceValue} />
                {/* {prescriptionInfo.insuranceType === 'tamin' && ( */}
                <ImportStatus type="favorite_service" />
                {/* )} */}
            </div>
            {/* )} */}
            <div className={styles['items']}>
                {getFavoriteServices.isLoading && <Overlay />}
                {favoriteItemByType.length > 0 &&
                    favoriteItemByType.map(
                        item =>
                            item.service.name
                                .toLowerCase()
                                .replace(/ي/g, 'ی')
                                .replace(/ك/g, 'ک')
                                .replace(/ /g, '')
                                .includes(
                                    searchServiceValue
                                        .toLowerCase()
                                        .replace(/ي/g, 'ی')
                                        .replace(/ك/g, 'ک')
                                        .replace(/ /g, '')
                                ) && (
                                <Item
                                    key={item.id}
                                    service={item}
                                    setFavoriteListSelect={setFavoriteListSelect}
                                    favoriteListSelect={favoriteListSelect}
                                />
                            )
                    )}
                <Mobile>
                    <FixedWrapBottom>
                        <Button block onClick={addItemList}>
                            افزودن اقلام انتخاب شده ({favoriteListSelect.length})
                        </Button>
                    </FixedWrapBottom>
                </Mobile>
                {favoriteItemByType.length === 0 && (
                    <div className={styles.emptyState}>
                        <svg
                            width="72"
                            height="72"
                            viewBox="0 0 72 72"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M39.9 24.3303L43.86 32.2503C44.4 33.3303 45.84 34.4103 47.04 34.5903L54.21 35.7903C58.8 36.5703 59.8799 39.8703 56.5799 43.1703L51 48.7503C50.07 49.6803 49.5299 51.5103 49.8299 52.8303L51.42 59.7603C52.68 65.2203 49.77 67.3503 44.94 64.5003L38.22 60.5103C36.99 59.7903 35.01 59.7903 33.78 60.5103L27.06 64.5003C22.23 67.3503 19.3199 65.2203 20.5799 59.7603L22.17 52.8303C22.47 51.5403 21.93 49.7103 21 48.7503L15.42 43.1703C12.12 39.8703 13.2 36.5403 17.79 35.7903L24.96 34.5903C26.16 34.3803 27.6 33.3303 28.14 32.2503L32.1 24.3303C34.23 20.0403 37.77 20.0403 39.9 24.3303Z"
                                fill="#27BDA0"
                            />
                            <path
                                opacity="0.4"
                                d="M18 29.25C16.77 29.25 15.75 28.23 15.75 27V6C15.75 4.77 16.77 3.75 18 3.75C19.23 3.75 20.25 4.77 20.25 6V27C20.25 28.23 19.23 29.25 18 29.25Z"
                                fill="#27BDA0"
                            />
                            <path
                                opacity="0.4"
                                d="M54 29.25C52.77 29.25 51.75 28.23 51.75 27V6C51.75 4.77 52.77 3.75 54 3.75C55.23 3.75 56.25 4.77 56.25 6V27C56.25 28.23 55.23 29.25 54 29.25Z"
                                fill="#27BDA0"
                            />
                            <path
                                opacity="0.4"
                                d="M36 14.25C34.77 14.25 33.75 13.23 33.75 12V6C33.75 4.77 34.77 3.75 36 3.75C37.23 3.75 38.25 4.77 38.25 6V12C38.25 13.23 37.23 14.25 36 14.25Z"
                                fill="#27BDA0"
                            />
                        </svg>
                        <span>برای ستاره دار کردن روی ستاره کنار دکمه افزودن بزن</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorite;
