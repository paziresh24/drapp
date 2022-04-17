import Button from '@paziresh24/shared/ui/button/index';
import styles from './finalize.module.scss';
import { useDiagnosis } from '@paziresh24/context/prescription/diagnosis-context';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { useServices } from '@paziresh24/context/prescription/services-context';
import { useBulkItems, useUpdatePrescription } from '@paziresh24/hooks/prescription/types/index';
import { useAddItemService, useFinalizePrescription } from '@paziresh24/hooks/prescription';
import { useBackPage } from '@paziresh24/context/core/backPage';
import { sendEvent } from '@paziresh24/utils';
import { toast } from 'react-toastify';
import Modal from '@paziresh24/shared/ui/modal';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { DeliverCase } from '../../deliver/deliverCase';
import TextArea from '@paziresh24/shared/ui/textArea';
import FormAuth from '../../auth/form';
import { useLocation, useHistory } from 'react-router';
import queryString from 'query-string';
import { useInsurances } from '@paziresh24/hooks/prescription/insurances';
import toastType from '@paziresh24/constants/prescription.json';
import isEmpty from 'lodash/isEmpty';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { usePaziresh } from '@paziresh24/hooks/drapp/turning';
import { prescriptionType } from '@paziresh24/constants/prescriptionType';
import { serviceType } from '@paziresh24/constants/serviceType';

const Finalize = () => {
    const { search } = useLocation();
    const urlParams = queryString.parse(search);
    const history = useHistory();

    const [diagnosis] = useDiagnosis();
    const [prescriptionInfo, setPrescriptionInfo] = useSelectPrescription();
    const [services] = useServices();
    const [backPage] = useBackPage();

    let isServiceWithVisitTamin = false;
    const [isServicesOfDoctors, setIsServicesOfDoctors] = useState(false);

    const bulkItems = useBulkItems();
    const finalizePrescription = useFinalizePrescription();
    const updatePrescription = useUpdatePrescription();
    const addItemService = useAddItemService();
    const insurances = useInsurances({ identifier: urlParams.identifier });
    const paziresh = usePaziresh();

    const [visitModal, setVisitModal] = useState(false);
    const [deliverModal, setDeliverModal] = useState(false);
    const [deliverConfirmModal, setDeliverConfirmModal] = useState(false);
    const [authForm, setAuthForm] = useState(false);
    const [referenceModal, setReferenceModal] = useState(false);

    const visitDescription = useRef();
    const referenceFeedback = useRef();

    const startPrescribeDateTime = useRef();

    const updatePrescriptionAction = (id, data) => {
        updatePrescription.mutate({
            prescriptionId: id,
            ...data
        });
    };

    useEffect(() => {
        startPrescribeDateTime.current = new Date();
    }, []);

    const servicesCloneRef = useRef();

    useEffect(() => {
        servicesCloneRef.current = services;
    }, [services]);

    const addItemToPrescription = items => {
        return bulkItems.mutateAsync({
            prescriptionId: prescriptionInfo.id,
            items
        });
    };

    const finalizePrescriptionAction = () => {
        return finalizePrescription.mutateAsync({
            prescriptionId: prescriptionInfo.id,
            referenceFeedback: referenceFeedback?.current?.value
        });
    };

    const submitVisit = async () => {
        try {
            if (prescriptionInfo.insuranceType === 'tamin') {
                await addItemService.mutateAsync({
                    prescriptionId: prescriptionInfo.id,
                    comments: visitDescription.current?.value ?? ''
                });
            }
            const data = await finalizePrescriptionAction();
            if (isEmpty(backPage)) {
                history.push('/', {
                    prescriptionInfo: data
                });
            } else {
                history.push('/consult/', {
                    room_id: urlParams.room_id
                });
            }
        } catch (error) {
            if (error.response.data.message === 'کد ملی / تلفن همراه پزشک معتبر نمی باشد') {
                return setAuthForm(true);
            }
            if (error.response?.data?.messages) {
                error.response.data?.messages.map(item => {
                    toast[toastType[item.type]](item.text);
                });
            } else {
                !toast.isActive('finalizeToast') &&
                    toast.error(error.response.data?.message, {
                        toastId: 'finalizeToast'
                    });
            }
        }
    };

    useEffect(() => {
        setIsServicesOfDoctors(
            prescriptionInfo.insuranceType === 'salamat' &&
                !isEmpty(services.filter(item => item.service_type === 5))
        );
    }, [services]);

    const submitServices = async () => {
        insurances.remove();

        if (services.length === 0 && !prescriptionInfo.finalized) {
            return setVisitModal(true);
        }

        if (diagnosis?.id) {
            updatePrescriptionAction(prescriptionInfo.id, {
                diagnosis: diagnosis.name,
                who_stem_id: diagnosis.id
            });
        }

        try {
            const servicesWithOutNullItem = services
                .filter(item => item.item_id !== null)
                .map(
                    ({
                        brand,
                        count,
                        date_do,
                        description,
                        how_to_use,
                        service,
                        number_of_period,
                        prescription_id,
                        use_instruction,
                        use_time
                    }) => {
                        return {
                            brand,
                            count,
                            date_do,
                            description,
                            how_to_use,
                            id: service.id,
                            number_of_period: +number_of_period,
                            prescription_id,
                            use_instruction,
                            use_time
                        };
                    }
                );
            const { items } = await addItemToPrescription(servicesWithOutNullItem);

            if (isServiceWithVisitTamin) {
                await addItemService.mutateAsync({
                    prescriptionId: prescriptionInfo.id,
                    comments: ''
                });
            }

            if (!prescriptionInfo.finalized) {
                const data = await finalizePrescriptionAction();
                getSplunkInstance().sendEvent({
                    group: 'prescription',
                    type: 'finalized',
                    event: {
                        prescription_info: prescriptionInfo
                    }
                });

                paziresh.mutate({
                    book_id: prescriptionInfo.identifier,
                    status: true
                });

                getSplunkInstance().sendEvent({
                    group: 'prescription',
                    type: 'duration',
                    event: {
                        start_date: startPrescribeDateTime.current,
                        end_date: new Date(),
                        duration: new Date().getTime() - startPrescribeDateTime.current.getTime(),
                        prescription_info: prescriptionInfo
                    }
                });

                sendEvent('sucsessfulPrescribe', 'prescription', 'sucsessfulPrescribe');
                if (isServicesOfDoctors) {
                    return setDeliverConfirmModal(true);
                }
                if (isEmpty(backPage)) {
                    history.push('/', {
                        prescriptionInfo: data
                    });
                } else {
                    history.push('/consult/', {
                        room_id: backPage
                    });
                }
            } else {
                if (isServicesOfDoctors) {
                    return setDeliverConfirmModal(true);
                }
                if (isEmpty(backPage)) {
                    history.push('/');
                }
                getSplunkInstance().sendEvent({
                    group: 'prescription',
                    type: 'edited',
                    event: { prescription_info: prescriptionInfo }
                });
                !toast.isActive('finalizePrescription') &&
                    toast.success('نسخه ویرایش شد.', {
                        toastId: 'finalizePrescription'
                    });
            }
        } catch (error) {
            getSplunkInstance().sendEvent({
                group: 'prescription',
                type: 'finalized-error',
                event: { error: error.response.data, prescription_info: prescriptionInfo }
            });
            if (
                error.response.data.prescription_type === prescriptionType.VISIT &&
                isServiceWithVisitTamin
            ) {
                isServiceWithVisitTamin = false;
                return submitServices();
            }
            if (error.response?.data?.messages) {
                error.response.data?.messages.map(item => {
                    toast[toastType[item.type]](item.text);
                });
            } else {
                !toast.isActive('finalizeToast') &&
                    toast.error(error.response.data?.message, {
                        toastId: 'finalizeToast'
                    });
            }
            if (error.response.data.message === 'کد ملی / تلفن همراه پزشک معتبر نمی باشد') {
                needAuth();
            }
        }
    };

    const openDeliverInfo = () => {
        setDeliverConfirmModal(false);
        setDeliverModal(true);
    };

    const needAuth = () => {
        insurances.refetch();
    };

    useEffect(() => {
        if (insurances.isSuccess) {
            setAuthForm(true);
        }
    }, [insurances.status]);

    return (
        <>
            {prescriptionInfo.insuranceType === 'salamat' && prescriptionInfo.finalized && (
                <Button
                    size="small"
                    className={styles.button}
                    onClick={() => {
                        if (
                            services.some(
                                item => item.service_type === serviceType.TAMIN.SERVICES_OF_DOCTORS
                            )
                        ) {
                            isServiceWithVisitTamin = true;
                        }
                        if (
                            prescriptionInfo.insuranceType === 'salamat' &&
                            prescriptionInfo.salamat_prescription.isReference
                        )
                            return setReferenceModal(true);
                        submitServices();
                    }}
                    loading={finalizePrescription.isLoading || bulkItems.isLoading}
                >
                    ویرایش
                </Button>
            )}
            {!prescriptionInfo.finalized && (
                <Button
                    size="small"
                    className={styles.button}
                    onClick={() => {
                        if (
                            services.some(
                                item => item.service_type === serviceType.TAMIN.SERVICES_OF_DOCTORS
                            )
                        ) {
                            isServiceWithVisitTamin = true;
                        }
                        if (
                            prescriptionInfo.insuranceType === 'salamat' &&
                            prescriptionInfo.salamat_prescription.isReference
                        )
                            return setReferenceModal(true);
                        submitServices();
                    }}
                    loading={finalizePrescription.isLoading || bulkItems.isLoading}
                >
                    نهایی سازی نسخه
                </Button>
            )}

            {isServicesOfDoctors && prescriptionInfo.finalized && (
                <Button
                    block
                    onClick={() => setDeliverConfirmModal(true)}
                    size="small"
                    className={styles.button}
                >
                    ارائه خدمت
                </Button>
            )}

            <Modal title="ویزیت" isOpen={visitModal} onClose={setVisitModal}>
                <span className="font-medium">
                    در نسخه آیتمی وجود ندارد، آیا می خواهید ویزیت ثبت کنید؟
                </span>
                {prescriptionInfo.insuranceType === 'tamin' && (
                    <TextArea ref={visitDescription} label="توضیحات ویزیت (اختیاری)" />
                )}
                <div className={styles.modalConfirmRow}>
                    <Button
                        block
                        onClick={submitVisit}
                        loading={finalizePrescription.isLoading || addItemService.isLoading}
                    >
                        ثبت ویزیت
                    </Button>
                    <Button block variant="secondary" onClick={() => setVisitModal(false)}>
                        انصراف
                    </Button>
                </div>
            </Modal>

            <Modal
                title="آیا میخواهید خدمات در مطب ارائه نمائید؟"
                isOpen={deliverConfirmModal}
                onClose={setDeliverConfirmModal}
            >
                <div className={styles.modalConfirmRow}>
                    <Button block variant="primary" onClick={openDeliverInfo}>
                        بله
                    </Button>
                    <Button block variant="secondary" onClick={() => history.push('/')}>
                        خیر
                    </Button>
                </div>
            </Modal>

            <Modal title="بازخورد ارجاع" isOpen={referenceModal} onClose={setReferenceModal}>
                <TextArea ref={referenceFeedback} />
                <div className={styles.modalConfirmRow}>
                    <Button block variant="primary" onClick={submitServices}>
                        ثبت بازخورد
                    </Button>
                </div>
            </Modal>

            <DeliverCase
                isOpen={deliverModal}
                onClose={setDeliverModal}
                prescriptionInfo={finalizePrescription.data ?? prescriptionInfo}
                trackingCode={
                    finalizePrescription?.data?.salamat_prescription?.trackingCode ??
                    prescriptionInfo?.salamat_prescription?.trackingCode
                }
                nationalCode={
                    finalizePrescription?.data?.patientNationalCode ??
                    prescriptionInfo?.patientNationalCode
                }
            />
            <Modal title="احرازهویت" isOpen={authForm} onClose={setAuthForm}>
                <FormAuth
                    provider={prescriptionInfo.insuranceType}
                    loggedIn={submitServices}
                    data={insurances.isSuccess && insurances.data[prescriptionInfo.insuranceType]}
                    onClose={setAuthForm}
                    identifier={urlParams.identifier}
                    noImport={true}
                />
            </Modal>
        </>
    );
};

export default Finalize;
