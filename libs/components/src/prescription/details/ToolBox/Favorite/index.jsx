import styles from './Favorite.module.scss';
import SearchBar from '../../../search/searchBar';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { useState, useLayoutEffect } from 'react';
import { useGetFavoriteServices } from '@paziresh24/hooks/prescription';
import { useFavoriteItem } from '@paziresh24/context/prescription/favoriteItem.context';
import { Overlay } from '@paziresh24/components/core/overlay';
import { useSelectType } from '@paziresh24/context/prescription/selectType-context';
import Button from '@paziresh24/components/core/button';
import { Mobile } from '@paziresh24/hooks/device';
import FixedWrapBottom from '@paziresh24/components/core/fixedWrapBottom';
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

                {searchServiceValue &&
                    !favoriteItemByType.some(item =>
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
                            )
                    ) && (
                        <div className={styles.emptyState}>
                            <svg
                                width="67"
                                height="65"
                                viewBox="0 0 67 65"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M37.3971 21.9647L41.0272 29.1147C41.5222 30.0897 42.8422 31.0647 43.9422 31.2272L50.5147 32.3106C54.7222 33.0147 55.7121 35.9939 52.6871 38.9731L47.5722 44.0106C46.7197 44.8502 46.2246 46.5022 46.4996 47.6939L47.9572 53.9502C49.1122 58.8793 46.4447 60.8022 42.0172 58.2293L35.8571 54.6272C34.7296 53.9772 32.9147 53.9772 31.7872 54.6272L25.6271 58.2293C21.1996 60.8022 18.5321 58.8793 19.6871 53.9502L21.1447 47.6939C21.4197 46.5293 20.9247 44.8772 20.0722 44.0106L14.9572 38.9731C11.9322 35.9939 12.9222 32.9876 17.1297 32.3106L23.7022 31.2272C24.8022 31.0377 26.1222 30.0897 26.6172 29.1147L30.2472 21.9647C32.1997 18.0918 35.4446 18.0918 37.3971 21.9647Z"
                                    fill="#7F8F9B"
                                />
                                <path
                                    opacity="0.4"
                                    d="M17.3223 26.4061C16.1948 26.4061 15.2598 25.4853 15.2598 24.3748V5.4165C15.2598 4.30609 16.1948 3.38525 17.3223 3.38525C18.4498 3.38525 19.3848 4.30609 19.3848 5.4165V24.3748C19.3848 25.4853 18.4498 26.4061 17.3223 26.4061Z"
                                    fill="#7F8F9B"
                                />
                                <path
                                    opacity="0.4"
                                    d="M50.3223 26.4061C49.1948 26.4061 48.2598 25.4853 48.2598 24.3748V5.4165C48.2598 4.30609 49.1948 3.38525 50.3223 3.38525C51.4498 3.38525 52.3848 4.30609 52.3848 5.4165V24.3748C52.3848 25.4853 51.4498 26.4061 50.3223 26.4061Z"
                                    fill="#7F8F9B"
                                />
                                <path
                                    opacity="0.4"
                                    d="M33.8223 12.8644C32.6948 12.8644 31.7598 11.9436 31.7598 10.8332V5.4165C31.7598 4.30609 32.6948 3.38525 33.8223 3.38525C34.9498 3.38525 35.8848 4.30609 35.8848 5.4165V10.8332C35.8848 11.9436 34.9498 12.8644 33.8223 12.8644Z"
                                    fill="#7F8F9B"
                                />
                            </svg>
                            <span>نتیجه ای یافت نشد.</span>
                        </div>
                    )}
                {!searchServiceValue && favoriteItemByType.length === 0 && (
                    <div className={styles.emptyState}>
                        <svg
                            width="67"
                            height="65"
                            viewBox="0 0 67 65"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M37.3971 21.9647L41.0272 29.1147C41.5222 30.0897 42.8422 31.0647 43.9422 31.2272L50.5147 32.3106C54.7222 33.0147 55.7121 35.9939 52.6871 38.9731L47.5722 44.0106C46.7197 44.8502 46.2246 46.5022 46.4996 47.6939L47.9572 53.9502C49.1122 58.8793 46.4447 60.8022 42.0172 58.2293L35.8571 54.6272C34.7296 53.9772 32.9147 53.9772 31.7872 54.6272L25.6271 58.2293C21.1996 60.8022 18.5321 58.8793 19.6871 53.9502L21.1447 47.6939C21.4197 46.5293 20.9247 44.8772 20.0722 44.0106L14.9572 38.9731C11.9322 35.9939 12.9222 32.9876 17.1297 32.3106L23.7022 31.2272C24.8022 31.0377 26.1222 30.0897 26.6172 29.1147L30.2472 21.9647C32.1997 18.0918 35.4446 18.0918 37.3971 21.9647Z"
                                fill="#7F8F9B"
                            />
                            <path
                                opacity="0.4"
                                d="M17.3223 26.4061C16.1948 26.4061 15.2598 25.4853 15.2598 24.3748V5.4165C15.2598 4.30609 16.1948 3.38525 17.3223 3.38525C18.4498 3.38525 19.3848 4.30609 19.3848 5.4165V24.3748C19.3848 25.4853 18.4498 26.4061 17.3223 26.4061Z"
                                fill="#7F8F9B"
                            />
                            <path
                                opacity="0.4"
                                d="M50.3223 26.4061C49.1948 26.4061 48.2598 25.4853 48.2598 24.3748V5.4165C48.2598 4.30609 49.1948 3.38525 50.3223 3.38525C51.4498 3.38525 52.3848 4.30609 52.3848 5.4165V24.3748C52.3848 25.4853 51.4498 26.4061 50.3223 26.4061Z"
                                fill="#7F8F9B"
                            />
                            <path
                                opacity="0.4"
                                d="M33.8223 12.8644C32.6948 12.8644 31.7598 11.9436 31.7598 10.8332V5.4165C31.7598 4.30609 32.6948 3.38525 33.8223 3.38525C34.9498 3.38525 35.8848 4.30609 35.8848 5.4165V10.8332C35.8848 11.9436 34.9498 12.8644 33.8223 12.8644Z"
                                fill="#7F8F9B"
                            />
                        </svg>
                        <span>
                            از طریق ستاره کنار اقلام داخل نسخه و یا از قسمت پراستفاده ها از مسیر
                            منوی سمت راست، اقلامی که بیشتر استفاده میکنید را به این لیست اضافه کنید.
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Favorite;
