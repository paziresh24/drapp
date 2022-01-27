import {
    useAddFavoriteServices,
    useDeleteFavoriteServices,
    useGetFavoriteServices
} from '@paziresh24/hooks/prescription';
import { useEffect, useRef } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';

import styles from './addTemplates.module.scss';
import Button from '@paziresh24/components/core/button';
import { useState } from 'react';
import { Tab, Tabs } from '@paziresh24/components/core/tab';
import LabsList from '@paziresh24/components/prescription/details/lists/lab.list';
import serviceTypeList from '@paziresh24/constants/serviceTypeList.json';
import DrugDetails from '@paziresh24/components/prescription/details/serviceDetails/details/Drugs';
import ImagingDetails from '@paziresh24/components/prescription/details/serviceDetails/details/Imaging';
import LabsDetails from '@paziresh24/components/prescription/details/serviceDetails/details/Labs';
import OthersDetails from '@paziresh24/components/prescription/details/serviceDetails/details/Others';
import { Overlay } from '@paziresh24/components/core/overlay';
import emptyState from '@paziresh24/components/prescription/templates/assets/empty_state.png';
import { isMobile } from 'react-device-detect';
import FixedWrapBottom from '@paziresh24/components/core/fixedWrapBottom/index';
import { toast } from 'react-toastify';

const ServiceFavorite = () => {
    const history = useHistory();
    const { prescriptionId } = useParams();
    const getFavoritePrescriptions = useGetFavoriteServices();
    const [salamatItems, setSalamatItems] = useState([]);
    const [taminItems, setTaminItems] = useState([]);
    const [type, setType] = useState('drugs');
    const [insuranceType, setInsuranceType] = useState('tamin');
    const [selectedFilter, setSelectedFilter] = useState({
        id: 1,
        name: 'drugs',
        title: 'دارو'
    });
    const deleteFavoriteServices = useDeleteFavoriteServices();
    const addFavoriteServices = useAddFavoriteServices();

    useEffect(() => {
        getFavoritePrescriptions.refetch();
    }, []);

    useEffect(() => {
        if (getFavoritePrescriptions.isSuccess) {
            setTaminItems(getFavoritePrescriptions.data.filter(item => item.provider === 'tamin'));
            setSalamatItems(
                getFavoritePrescriptions.data.filter(item => item.provider === 'salamat')
            );

            if (
                getFavoritePrescriptions.data.filter(item => item.provider === 'salamat')?.length >
                0
            ) {
                setInsuranceType('salamat');
            }
            if (
                getFavoritePrescriptions.data.filter(item => item.provider === 'tamin')?.length > 0
            ) {
                setInsuranceType('tamin');
            }
        }
    }, [getFavoritePrescriptions.status]);

    useEffect(() => {
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
    }, [insuranceType, salamatItems, taminItems]);

    useEffect(() => {
        if (deleteFavoriteServices.isSuccess && addFavoriteServices.isSuccess) {
            toast.success('اقلام پراستفاده ذخیره شدند.');
        }
    }, [deleteFavoriteServices.status, addFavoriteServices.status]);

    const edit = () => {
        getFavoritePrescriptions.data
            .filter(item => item.provider === 'salamat')
            .forEach(({ id }) => {
                deleteFavoriteServices.mutate({ id });
            });
        getFavoritePrescriptions.data
            .filter(item => item.provider === 'tamin')
            .forEach(({ id }) => {
                deleteFavoriteServices.mutate({ id });
            });

        salamatItems.forEach(service => {
            addFavoriteServices.mutate({
                use_instruction: service.use_instruction,
                use_time: service.use_time,
                how_to_use: service.how_to_use,
                service: service.service.id,
                count: service.count,
                description: service.description,
                ...(service.number_of_period && { number_of_period: service.number_of_period }),
                provider: 'salamat',
                type: undefined
            });
        });

        taminItems.forEach(service => {
            addFavoriteServices.mutate({
                use_instruction: service.use_instruction,
                use_time: service.use_time,
                how_to_use: service.how_to_use,
                service: service.service.id,
                count: service.count,
                description: service.description,
                ...(service.number_of_period && { number_of_period: service.number_of_period }),
                provider: 'tamin',
                type: undefined
            });
        });
        getFavoritePrescriptions.refetch();
    };

    const getNumberBadge = type => {
        if (insuranceType === 'salamat') {
            return salamatItems.filter(service =>
                serviceTypeList[type][insuranceType].includes(+service.service_type)
            ).length;
        } else {
            return taminItems.filter(service =>
                serviceTypeList[type][insuranceType].includes(+service.service_type)
            ).length;
        }
    };

    return (
        <div className={styles.wrapper}>
            {isMobile && (
                <div className={styles.nagivate}>
                    <Link to="/favorite/templates">نسخه پراستفاده</Link>
                    <hr />
                    <Link to="#" className={styles.active}>
                        اقلام پراستفاده
                    </Link>
                </div>
            )}
            <div className={styles.templatesWrapper}>
                <div
                    className="w-full flex justify-between items-center"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        padding: '1.5rem'
                    }}
                >
                    <div className={styles.providerWrapper} style={{ marginRight: '0' }}>
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

                    {!isMobile && (
                        <Button
                            onClick={edit}
                            size="medium"
                            loading={
                                deleteFavoriteServices.isLoading ||
                                addFavoriteServices.isLoading ||
                                getFavoritePrescriptions.isLoading
                            }
                        >
                            اعمال تغییرات
                        </Button>
                    )}
                    {isMobile && (
                        <FixedWrapBottom>
                            <Button block size="medium" onClick={edit}>
                                اعمال تغییرات
                            </Button>
                        </FixedWrapBottom>
                    )}
                </div>

                <Tabs activeTab={selectedFilter.name} onChange={tab => setType(tab)}>
                    <Tab keyTab="drugs" title="تجویز دارو" numberBadge={getNumberBadge('drugs')}>
                        <DrugDetails
                            services={insuranceType === 'salamat' ? salamatItems : taminItems}
                            setServices={
                                insuranceType === 'salamat' ? setSalamatItems : setTaminItems
                            }
                            insuranceType={insuranceType}
                            noDate={true}
                        />
                    </Tab>
                    <Tab
                        keyTab="lab"
                        title="آزمایشگاه"
                        id="lab_tab_step"
                        numberBadge={getNumberBadge('lab')}
                    >
                        <LabsDetails
                            services={insuranceType === 'salamat' ? salamatItems : taminItems}
                            setServices={
                                insuranceType === 'salamat' ? setSalamatItems : setTaminItems
                            }
                            noDate={true}
                            insuranceType={insuranceType}
                        />
                    </Tab>
                    <Tab
                        keyTab="imaging"
                        title="تصویربرداری"
                        numberBadge={getNumberBadge('imaging')}
                    >
                        <ImagingDetails
                            services={insuranceType === 'salamat' ? salamatItems : taminItems}
                            setServices={
                                insuranceType === 'salamat' ? setSalamatItems : setTaminItems
                            }
                            insuranceType={insuranceType}
                            noDate={true}
                        />
                    </Tab>
                    <Tab
                        keyTab="others"
                        title="پاراکلینیک"
                        id="other_tab_step"
                        numberBadge={getNumberBadge('others')}
                    >
                        <OthersDetails
                            services={insuranceType === 'salamat' ? salamatItems : taminItems}
                            setServices={
                                insuranceType === 'salamat' ? setSalamatItems : setTaminItems
                            }
                            insuranceType={insuranceType}
                            noDate={true}
                        />
                    </Tab>
                </Tabs>
            </div>
            {getFavoritePrescriptions.isSuccess && (
                <div
                    className={styles.templatesWrapper}
                    style={{ padding: '0.8rem', paddingTop: '0.2rem' }}
                >
                    <LabsList
                        noDate={true}
                        services={insuranceType === 'salamat' ? salamatItems : taminItems}
                        setServices={insuranceType === 'salamat' ? setSalamatItems : setTaminItems}
                        type={type}
                        insuranceType={insuranceType}
                        noFavorite={true}
                    />
                    {insuranceType === 'tamin'
                        ? !taminItems.some(service =>
                              serviceTypeList[type][insuranceType].includes(service.service_type)
                          ) && (
                              <div
                                  style={{
                                      margin: '0 auto',
                                      padding: '10rem',
                                      display: 'flex',
                                      gap: '2rem',
                                      justifyContent: 'center',
                                      alignItems: 'center'
                                  }}
                              >
                                  <img src={emptyState} alt="" style={{ width: '6rem' }} />
                                  <span
                                      style={{
                                          fontSize: '1.4rem',
                                          fontWeight: '500',
                                          opacity: '0.7'
                                      }}
                                  >
                                      خدمتی در این دسته بندی وجود ندارد.
                                  </span>
                              </div>
                          )
                        : !salamatItems.some(service =>
                              serviceTypeList[type][insuranceType].includes(service.service_type)
                          ) && (
                              <div
                                  style={{
                                      margin: '0 auto',
                                      padding: '10rem',
                                      display: 'flex',
                                      gap: '2rem',
                                      justifyContent: 'center',
                                      alignItems: 'center'
                                  }}
                              >
                                  <img src={emptyState} alt="" style={{ width: '6rem' }} />
                                  <span
                                      style={{
                                          fontSize: '1.4rem',
                                          fontWeight: '500',
                                          opacity: '0.7'
                                      }}
                                  >
                                      خدمتی در این دسته بندی وجود ندارد.
                                  </span>
                              </div>
                          )}
                </div>
            )}
        </div>
    );
};

export default ServiceFavorite;
