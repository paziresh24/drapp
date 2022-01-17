import styles from './templateItem.module.scss';
import { TrashIcon, ChevronIcon } from '../../../icons';
import { useHistory } from 'react-router-dom';
import { useDeleteFavoritePrescriptions } from '@paziresh24/hooks/prescription';
import LabsList from '../../details/lists/lab.list';
import { useState, useEffect } from 'react';
import serviceTypeList from '@paziresh24/constants/serviceTypeList.json';

const TemplateItem = ({ name, id, salamatItems, taminItems, refetch }) => {
    const history = useHistory();
    const [insuranceType, setInsuranceType] = useState('tamin');
    const deleteFavoritePrescriptions = useDeleteFavoritePrescriptions();
    const [isOpenDetails, setIsOpenDetails] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState();

    const removeTemplate = () => {
        deleteFavoritePrescriptions.mutate(id, {
            onSuccess: () => {
                refetch();
            }
        });
    };

    const filterButton = [
        {
            id: 1,
            name: 'drugs',
            title: 'دارو'
        },
        {
            id: 2,
            name: 'lab',
            title: 'آزمایش'
        },
        {
            id: 3,
            name: 'imaging',
            title: 'تصویربرداری'
        },
        {
            id: 4,
            name: 'others',
            title: 'پاراکلینیک'
        }
    ];

    useEffect(() => {
        if (isOpenDetails) {
            if (taminItems.length > 0) {
                return setInsuranceType('tamin');
            }
            if (salamatItems.length > 0) {
                return setInsuranceType('salamat');
            }
        }
    }, [isOpenDetails]);

    useEffect(() => {
        if (isOpenDetails) {
            if (
                insuranceType === 'salamat'
                    ? salamatItems.some(service =>
                          serviceTypeList['drugs'][insuranceType].includes(service.service_type)
                      )
                    : taminItems.some(service =>
                          serviceTypeList['drugs'][insuranceType].includes(service.service_type)
                      )
            ) {
                return setSelectedFilter({
                    id: 1,
                    name: 'drugs',
                    title: 'دارو'
                });
            }

            if (
                insuranceType === 'salamat'
                    ? salamatItems.some(service =>
                          serviceTypeList['lab'][insuranceType].includes(service.service_type)
                      )
                    : taminItems.some(service =>
                          serviceTypeList['lab'][insuranceType].includes(service.service_type)
                      )
            ) {
                return setSelectedFilter({
                    id: 2,
                    name: 'lab',
                    title: 'آزمایش'
                });
            }

            if (
                insuranceType === 'salamat'
                    ? salamatItems.some(service =>
                          serviceTypeList['imaging'][insuranceType].includes(service.service_type)
                      )
                    : taminItems.some(service =>
                          serviceTypeList['imaging'][insuranceType].includes(service.service_type)
                      )
            ) {
                return setSelectedFilter({
                    id: 3,
                    name: 'imaging',
                    title: 'تصویربرداری'
                });
            }

            if (
                insuranceType === 'salamat'
                    ? salamatItems.some(service =>
                          serviceTypeList['others'][insuranceType].includes(service.service_type)
                      )
                    : taminItems.some(service =>
                          serviceTypeList['others'][insuranceType].includes(service.service_type)
                      )
            ) {
                return setSelectedFilter({
                    id: 4,
                    name: 'others',
                    title: 'پاراکلینیک'
                });
            }
        }
    }, [insuranceType, isOpenDetails]);

    return (
        <div className={styles.wrapper}>
            <div
                className={styles.header}
                onClick={() => setIsOpenDetails(prev => !prev)}
                aria-hidden
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem',
                        cursor: 'pointer'
                    }}
                >
                    <ChevronIcon dir={isOpenDetails ? 'top' : 'bottom'} />
                    <span className={styles.title}>{name}</span>
                </div>

                <div
                    className={styles.actionWrapper}
                    onClick={e => e.stopPropagation()}
                    aria-hidden
                >
                    <div>
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 17 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={() => history.push(`/favorite/templates/${id}`)}
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M11.7036 3.94879C12.0606 3.59177 12.6394 3.59178 12.9965 3.9488C13.3535 4.30582 13.3534 4.88464 12.9964 5.24164L12.5949 5.64319L12.5772 5.51944C11.9055 5.6154 11.3298 5.03966 11.4257 4.36797L11.3021 4.3503L11.7036 3.94879ZM10.0646 4.17353L9.94082 4.15584C9.9332 4.20919 9.92729 4.26229 9.92305 4.3151L4.89661 9.34148L4.84265 9.39544L4.84264 9.39545C4.1154 10.1225 3.68092 10.5569 3.37924 11.0898C3.07756 11.6226 2.92861 12.2186 2.67929 13.2163L2.66078 13.2904L2.53155 13.8073C2.48895 13.9777 2.53887 14.1579 2.66306 14.2821C2.78725 14.4063 2.9675 14.4562 3.13789 14.4136L3.65484 14.2844L3.72889 14.2659C4.72657 14.0166 5.32262 13.8676 5.85543 13.5659C6.38824 13.2643 6.82264 12.8298 7.54972 12.1026L7.60369 12.0486L12.6302 7.02213C12.6829 7.01789 12.736 7.01199 12.7893 7.00437L12.7717 6.88062L13.7035 5.94875C14.4511 5.20122 14.4511 3.98925 13.7036 3.24171C12.956 2.49415 11.744 2.49413 10.9965 3.24167L10.0646 4.17353ZM11.4198 6.81829L6.89659 11.3415C6.09922 12.1389 5.76318 12.469 5.36273 12.6957C4.99989 12.9012 4.59144 13.0176 3.70408 13.2411C3.92759 12.3538 4.044 11.9453 4.24944 11.5825C4.47617 11.182 4.80633 10.846 5.60372 10.0486L10.1269 5.52544C10.3809 6.10041 10.8448 6.56436 11.4198 6.81829Z"
                                fill="#3F3F79"
                            />
                        </svg>
                    </div>

                    <div onClick={removeTemplate} aria-hidden>
                        <TrashIcon color="#3F3F79" />
                    </div>
                </div>
            </div>
            {isOpenDetails && (
                <div className={styles.detailsWrapper}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className={styles.searchFilterWrapper}>
                            {filterButton.map(item =>
                                insuranceType === 'salamat'
                                    ? salamatItems.filter(service =>
                                          serviceTypeList[item.name][insuranceType].includes(
                                              +service.service_type
                                          )
                                      ).length > 0 && (
                                          <button
                                              key={item.id}
                                              onClick={() => setSelectedFilter(item)}
                                              className={`${styles.searchFilterButton} ${
                                                  selectedFilter?.id === item.id
                                                      ? styles.selected
                                                      : ''
                                              }`}
                                          >
                                              {item.title}
                                          </button>
                                      )
                                    : taminItems.filter(service =>
                                          serviceTypeList[item.name][insuranceType].includes(
                                              +service.service_type
                                          )
                                      ).length > 0 && (
                                          <button
                                              key={item.id}
                                              onClick={() => setSelectedFilter(item)}
                                              className={`${styles.searchFilterButton} ${
                                                  selectedFilter?.id === item.id
                                                      ? styles.selected
                                                      : ''
                                              }`}
                                          >
                                              {item.title}
                                          </button>
                                      )
                            )}
                        </div>
                        <div className={styles.providerWrapper}>
                            <button
                                className={`${styles.providerButton} ${
                                    insuranceType === 'tamin' ? styles.selected : ''
                                }`}
                                onClick={() => setInsuranceType('tamin')}
                            >
                                تامین اجتماعی
                            </button>
                            <button
                                className={`${styles.providerButton} ${
                                    insuranceType === 'salamat' ? styles.selected : ''
                                }`}
                                onClick={() => setInsuranceType('salamat')}
                            >
                                سلامت
                            </button>
                        </div>
                    </div>

                    <div style={{ paddingBottom: '1rem' }}>
                        {selectedFilter && (
                            <LabsList
                                services={insuranceType === 'salamat' ? salamatItems : taminItems}
                                type={selectedFilter.name}
                                insuranceType={insuranceType}
                                readOnly={true}
                                noDate={true}
                                noFavorite={true}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TemplateItem;
