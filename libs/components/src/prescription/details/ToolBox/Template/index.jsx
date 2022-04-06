import styles from './Template.module.scss';
import { useState } from 'react';
import { useGetFavoritePrescriptions } from '@paziresh24/hooks/prescription';
import SearchBar from '@paziresh24/components/prescription/search/searchBar';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { Overlay } from '@paziresh24/components/core/overlay';
import Item from './item';
import { useTemplateItem } from '@paziresh24/context/prescription/templateItem.context';
import ImportStatus from './../ImportStatus/index';
import isEmpty from 'lodash/isEmpty';

const Template = () => {
    const [prescriptionInfo] = useSelectPrescription();
    const [isOpen, setIsOpen] = useState(false);
    const [templateItem, setTemplateItem] = useTemplateItem();
    const getFavoritePrescriptions = useGetFavoritePrescriptions({
        [prescriptionInfo.insuranceType + 'Items_null']: false
    });
    const [isOpenImportModal, setIsOpenImportModal] = useState(false);
    const [searchPrescriptionsValue, setSearchPrescriptionsValue] = useState('');

    return (
        <div className={styles.wrapper}>
            <div className={styles['searchWrapper']}>
                <SearchBar label="جستجوی بین نسخه ها ..." value={setSearchPrescriptionsValue} />
                {prescriptionInfo.insuranceType === 'tamin' && (
                    <ImportStatus
                        type="favorite_prescription"
                        isOpenImportModal={isOpenImportModal}
                        setIsOpenImportModal={setIsOpenImportModal}
                    />
                )}
            </div>
            {prescriptionInfo.insuranceType === 'tamin' && getFavoritePrescriptions.isSuccess && (
                <div className="flex items-center justify-between p-4">
                    <span className="font-medium text-opacity-80 text-sm">
                        اقلام و نسخه های پنل تامین اجتماعی
                    </span>
                    <span
                        className="font-semibold text-sm underline cursor-pointer"
                        onClick={() => setIsOpenImportModal(true)}
                    >
                        واکشی و نمایش
                    </span>
                </div>
            )}

            <div className={styles['items']}>
                {templateItem.length > 0 &&
                    templateItem.map(
                        prescription =>
                            !isEmpty(prescription[prescriptionInfo.insuranceType + 'Items']) &&
                            prescription.name
                                .toLowerCase()
                                .replace(/ي/g, 'ی')
                                .replace(/ك/g, 'ک')
                                .replace(/ /g, '')
                                .includes(
                                    searchPrescriptionsValue
                                        .toLowerCase()
                                        .replace(/ي/g, 'ی')
                                        .replace(/ك/g, 'ک')
                                        .replace(/ /g, '')
                                ) && (
                                <Item
                                    key={prescription.id}
                                    prescription={prescription}
                                    isOpen={isOpen}
                                    setIsOpen={setIsOpen}
                                />
                            )
                    )}
                {searchPrescriptionsValue &&
                    !templateItem.some(
                        prescription =>
                            !isEmpty(prescription[prescriptionInfo.insuranceType + 'Items']) &&
                            prescription.name
                                .toLowerCase()
                                .replace(/ي/g, 'ی')
                                .replace(/ك/g, 'ک')
                                .replace(/ /g, '')
                                .includes(
                                    searchPrescriptionsValue
                                        .toLowerCase()
                                        .replace(/ي/g, 'ی')
                                        .replace(/ك/g, 'ک')
                                        .replace(/ /g, '')
                                )
                    ) && (
                        <div className={styles.emptyState}>
                            <svg
                                width="72"
                                height="72"
                                viewBox="0 0 72 72"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M63.18 35.4603L62.7 34.8003C61.86 33.7803 60.87 32.9703 59.73 32.3703C58.2 31.5003 56.46 31.0503 54.66 31.0503H17.31C15.51 31.0503 13.8 31.5003 12.24 32.3703C11.07 33.0003 10.02 33.8703 9.15 34.9503C7.44 37.1403 6.63 39.8403 6.9 42.5403L8.01 56.5503C8.4 60.7803 8.91 66.0003 18.42 66.0003H53.58C63.09 66.0003 63.57 60.7803 63.99 56.5203L65.1 42.5703C65.37 40.0503 64.71 37.5303 63.18 35.4603ZM43.17 52.0203H28.8C27.63 52.0203 26.7 51.0603 26.7 49.9203C26.7 48.7803 27.63 47.8203 28.8 47.8203H43.17C44.34 47.8203 45.27 48.7803 45.27 49.9203C45.27 51.0903 44.34 52.0203 43.17 52.0203Z"
                                    fill="#7F8F9B"
                                />
                                <path
                                    opacity="0.4"
                                    d="M10.14 33.93C10.8 33.33 11.46 32.79 12.24 32.37C13.77 31.5 15.51 31.05 17.31 31.05H54.69C56.49 31.05 58.2 31.5 59.76 32.37C60.54 32.79 61.23 33.33 61.86 33.96V32.37V29.46C61.86 18.75 58.59 15.48 47.88 15.48H40.74C39.42 15.48 39.39 15.45 38.61 14.43L35.01 9.6C33.3 7.38 31.95 6 27.66 6H24.12C13.41 6 10.14 9.27 10.14 19.98V32.4V33.93Z"
                                    fill="#7F8F9B"
                                />
                            </svg>
                            <span>نتیجه ای یافت نشد.</span>
                        </div>
                    )}
                {!searchPrescriptionsValue && templateItem.length === 0 && (
                    <div className={styles.emptyState}>
                        <svg
                            width="72"
                            height="72"
                            viewBox="0 0 72 72"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M63.18 35.4603L62.7 34.8003C61.86 33.7803 60.87 32.9703 59.73 32.3703C58.2 31.5003 56.46 31.0503 54.66 31.0503H17.31C15.51 31.0503 13.8 31.5003 12.24 32.3703C11.07 33.0003 10.02 33.8703 9.15 34.9503C7.44 37.1403 6.63 39.8403 6.9 42.5403L8.01 56.5503C8.4 60.7803 8.91 66.0003 18.42 66.0003H53.58C63.09 66.0003 63.57 60.7803 63.99 56.5203L65.1 42.5703C65.37 40.0503 64.71 37.5303 63.18 35.4603ZM43.17 52.0203H28.8C27.63 52.0203 26.7 51.0603 26.7 49.9203C26.7 48.7803 27.63 47.8203 28.8 47.8203H43.17C44.34 47.8203 45.27 48.7803 45.27 49.9203C45.27 51.0903 44.34 52.0203 43.17 52.0203Z"
                                fill="#7F8F9B"
                            />
                            <path
                                opacity="0.4"
                                d="M10.14 33.93C10.8 33.33 11.46 32.79 12.24 32.37C13.77 31.5 15.51 31.05 17.31 31.05H54.69C56.49 31.05 58.2 31.5 59.76 32.37C60.54 32.79 61.23 33.33 61.86 33.96V32.37V29.46C61.86 18.75 58.59 15.48 47.88 15.48H40.74C39.42 15.48 39.39 15.45 38.61 14.43L35.01 9.6C33.3 7.38 31.95 6 27.66 6H24.12C13.41 6 10.14 9.27 10.14 19.98V32.4V33.93Z"
                                fill="#7F8F9B"
                            />
                        </svg>
                        <span>نسخه پراستفاده ای وجود ندارد.</span>
                    </div>
                )}

                {getFavoritePrescriptions.isLoading && <Overlay />}
            </div>
        </div>
    );
};

export default Template;
