/* eslint-disable @nrwl/nx/enforce-module-boundaries */
// HOOKS
import { useMe } from '@paziresh24/context/prescription/me-context';

import styles from '../../../assets/styles/pages/prescription/types.module.scss';

import { useParams } from 'react-router-dom';
import { Tabs, Tab } from '@paziresh24/shared/ui/tab';
import { useEffect, useLayoutEffect } from 'react';
import {
    useGetFavoritePrescriptions,
    useGetFavoriteServices,
    useGetItemServices,
    useGetOnePrescription
} from '@paziresh24/hooks/prescription/index';

// COMPONENTS
import Error from '@paziresh24/shared/ui/error';
import isEmpty from 'lodash/isEmpty';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { useServices } from '@paziresh24/context/prescription/services-context';
import Service from '../../../components/molecules/details/service';
import ToolBox from '../../../components/molecules/details/ToolBox/index';
import Info from '../../../components/molecules/details/Info';
import { useSelectType } from '@paziresh24/context/prescription/selectType-context';
import { useFavoriteItem } from '@paziresh24/context/prescription/favoriteItem.context';
import serviceTypeList from '@paziresh24/constants/serviceTypeList.json';
import { useTemplateItem } from '@paziresh24/context/prescription/templateItem.context';
import { useLocation } from 'react-router';
import LabsList from '../../../components/molecules/details/lists/lab.list';
import { useState } from 'react';

const Types = () => {
    const [me] = useMe();
    const location = useLocation();
    const [prescriptionInfo, setPrescriptionInfo] = useSelectPrescription();
    const { prescriptionId } = useParams();
    const [services, setServices] = useServices();
    const getPrescription = useGetOnePrescription({ id: prescriptionId ?? prescriptionInfo?.id });
    const getItemServices = useGetItemServices({
        prescriptionId: prescriptionId ?? prescriptionInfo?.id
    });
    const [isShowToolBox, setIsShowToolBox] = useState(false);

    const [favoriteItem, setFavoriteItem] = useFavoriteItem();
    const [templateItem, setTemplateItem] = useTemplateItem();

    const [type, setType] = useSelectType();

    useLayoutEffect(() => {
        // componentWillUnmount
        setType('drugs');

        return () => {
            getItemServices.remove();
            setType('drugs');
            // setFavoriteItem([]);
            // setTemplateItem([]);
            setPrescriptionInfo(null);
            setServices([]);
        };
    }, []);

    useLayoutEffect(() => {
        if (location.state?.prescriptionInfo) {
            setPrescriptionInfo(location.state?.prescriptionInfo);
        }
        getData();
    }, [prescriptionId, me]);

    useEffect(() => {
        if (getPrescription.isSuccess) {
            prescriptionInfo && setPrescriptionInfo(getPrescription.data);
        }
    }, [getPrescription.status, prescriptionInfo]);

    const getData = async () => {
        const prescription = await getPrescription.refetch();
        if (prescription.isSuccess) {
            setPrescriptionInfo(prescription.data);
            setTimeout(() => {
                // getTypes.refetch();
                getItemServices.refetch();
            });
        }
    };

    const getFavoriteServices = useGetFavoriteServices({
        provider: prescriptionInfo?.insuranceType,
        _limit: 1000
    });

    const getFavoritePrescriptions = useGetFavoritePrescriptions({
        [prescriptionInfo?.insuranceType + 'Items_null']: false
    });

    useEffect(() => {
        // getFavoriteServices.remove();
        if (!isEmpty(prescriptionInfo)) {
            getFavoriteServices.remove();
            getFavoritePrescriptions.remove();
            setTimeout(() => {
                getFavoriteServices.refetch();
                getFavoritePrescriptions.refetch();
            }, 0);
            checkShowToolBox();
        }
    }, [prescriptionInfo]);

    const checkShowToolBox = () => {
        if (prescriptionInfo.insuranceType === 'tamin' && prescriptionInfo.finalized) {
            return setIsShowToolBox(false);
        }

        return setIsShowToolBox(true);
    };

    useLayoutEffect(() => {
        if (getFavoritePrescriptions.isSuccess) {
            setTemplateItem(getFavoritePrescriptions.data);
            // getFavoritePrescriptions.remove();
        }
    }, [getFavoritePrescriptions.status]);

    useLayoutEffect(() => {
        if (getFavoriteServices.isSuccess) {
            setFavoriteItem(getFavoriteServices.data);
            // getFavoriteServices.remove();
        }
    }, [getFavoriteServices.status]);

    useEffect(() => {
        if (getItemServices.isSuccess && !isEmpty(getItemServices.data && prescriptionInfo)) {
            const services_clone = getItemServices.data.map((service, i) => ({
                ...service,
                id: i,
                service_type: service.service_type.id,
                isServicesOfDoctors: service.service_type.id === 5
            }));
            setServices(services_clone);

            if (isEmpty(services_clone)) {
                return setType('drugs');
            }

            if (
                services_clone.some(service =>
                    serviceTypeList['drugs'][prescriptionInfo.insuranceType].includes(
                        service.service_type
                    )
                )
            ) {
                return setType('drugs');
            }

            if (
                services_clone.some(service =>
                    serviceTypeList['lab'][prescriptionInfo.insuranceType].includes(
                        service.service_type
                    )
                )
            ) {
                return setType('lab');
            }

            if (
                services_clone.some(service =>
                    serviceTypeList['imaging'][prescriptionInfo.insuranceType].includes(
                        service.service_type
                    )
                )
            ) {
                return setType('imaging');
            }

            if (
                services_clone.some(service =>
                    serviceTypeList['others'][prescriptionInfo.insuranceType].includes(
                        service.service_type
                    )
                )
            ) {
                return setType('others');
            }

            if (
                prescriptionInfo.insuranceType === 'salamat' &&
                services_clone.some(service =>
                    serviceTypeList['equipment'][prescriptionInfo.insuranceType].includes(
                        service.service_type
                    )
                )
            ) {
                return setType('equipment');
            }
        }
    }, [getItemServices.status, prescriptionInfo]);

    return (
        <>
            <div className={styles['wrapper']}>
                <div className={styles['types']}>
                    {prescriptionInfo && <Info />}
                    {prescriptionInfo?.insuranceType && (
                        <>
                            <Tabs activeTab={type}>
                                <Tab
                                    keyTab="drugs"
                                    title="تجویز دارو"
                                    numberBadge={
                                        getItemServices.isSuccess &&
                                        services.filter(service =>
                                            serviceTypeList['drugs'][
                                                prescriptionInfo.insuranceType
                                            ].includes(+service.service_type)
                                        ).length
                                    }
                                >
                                    <Service type="drugs" />
                                </Tab>
                                <Tab
                                    keyTab="lab"
                                    title="آزمایش"
                                    id="lab_tab_step"
                                    numberBadge={
                                        getItemServices.isSuccess &&
                                        services.filter(service =>
                                            serviceTypeList['lab'][
                                                prescriptionInfo.insuranceType
                                            ].includes(+service.service_type)
                                        ).length
                                    }
                                >
                                    <Service type="lab" />
                                </Tab>
                                <Tab
                                    keyTab="imaging"
                                    title="تصویربرداری"
                                    numberBadge={
                                        getItemServices.isSuccess &&
                                        services.filter(service =>
                                            serviceTypeList['imaging'][
                                                prescriptionInfo.insuranceType
                                            ].includes(+service.service_type)
                                        ).length
                                    }
                                >
                                    <Service type="imaging" />
                                </Tab>
                                <Tab
                                    keyTab="others"
                                    title="پاراکلینیک"
                                    id="other_tab_step"
                                    numberBadge={
                                        getItemServices.isSuccess &&
                                        services.filter(service =>
                                            serviceTypeList['others'][
                                                prescriptionInfo.insuranceType
                                            ].includes(+service.service_type)
                                        ).length
                                    }
                                >
                                    <Service type="others" />
                                </Tab>
                                {prescriptionInfo?.insuranceType === 'salamat' && (
                                    <Tab
                                        keyTab="equipment"
                                        title="تجهیزات"
                                        numberBadge={
                                            getItemServices.isSuccess &&
                                            services.filter(service =>
                                                serviceTypeList['equipment'][
                                                    prescriptionInfo.insuranceType
                                                ].includes(+service.service_type)
                                            ).length
                                        }
                                    >
                                        <Service type="equipment" />
                                    </Tab>
                                )}
                            </Tabs>
                            <LabsList
                                services={services}
                                setServices={setServices}
                                insuranceType={prescriptionInfo.insuranceType}
                                type={type}
                                readOnly={
                                    prescriptionInfo.insuranceType === 'tamin' &&
                                    prescriptionInfo.finalized
                                }
                            />
                        </>
                    )}
                </div>
                {isShowToolBox && <ToolBox />}
            </div>

            {getPrescription.isError && getPrescription.error.response?.status !== 404 && (
                <Error
                    code="500"
                    error="Failed to Connect to Server."
                    message="خطا در برقراری ارتباط با سرور"
                />
            )}

            {getPrescription.isError &&
                prescriptionId &&
                getPrescription.error.response?.status === 404 && (
                    <Error
                        code="404"
                        error="Prescription Not Found"
                        message={`نسخه ای با شناسه ${prescriptionId} وجود ندارد.`}
                    />
                )}
        </>
    );
};

export default Types;
