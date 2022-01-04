import Button from './../../../core/button/index';
import styles from './finalize.module.scss';
import { useDiagnosis } from '@paziresh24/context/prescription/diagnosis-context';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { useServices } from '@paziresh24/context/prescription/services-context';
import { useBulkItems, useUpdatePrescription } from '@paziresh24/hooks/prescription/types/index';
import { useAddItemService, useFinalizePrescription } from '@paziresh24/hooks/prescription';
import { useBackPage } from '@paziresh24/context/core/backPage';
import { sendEvent } from '@paziresh24/utils';
import { toast } from 'react-toastify';
import Modal from '../../../core/modal';
import { useState, useEffect, useRef } from 'react';
import { DeliverCase } from '../../deliver/deliverCase';
import TextArea from '../../../core/textArea';
import FormAuth from '../../auth/form';
import { useLocation, useHistory } from 'react-router';
import queryString from 'query-string';
import { useInsurances } from '@paziresh24/hooks/prescription/insurances';
import toastType from '@paziresh24/constants/prescription.json';
import isEmpty from 'lodash/isEmpty';

const Finalize = () => {
    const { search } = useLocation();
    const urlParams = queryString.parse(search);
    const history = useHistory();

    // global state
    const [diagnosis] = useDiagnosis();
    const [prescriptionInfo, setPrescriptionInfo] = useSelectPrescription();
    const [services] = useServices();
    const [backPage] = useBackPage();

    // api hook
    const bulkItems = useBulkItems();
    const finalizePrescription = useFinalizePrescription();
    const updatePrescription = useUpdatePrescription();
    const addItemService = useAddItemService();
    const insurances = useInsurances({ identifier: urlParams.identifier });

    // modal
    const [visitModal, setVisitModal] = useState(false);
    const [deliverModal, setDeliverModal] = useState(false);
    const [deliverConfirmModal, setDeliverConfirmModal] = useState(false);
    const [authForm, setAuthForm] = useState(false);

    const visitDescription = useRef();

    const updatePrescriptionAction = (id, data) => {
        updatePrescription.mutate({
            prescriptionId: id,
            ...data
        });
    };

    const addItemToPrescription = items => {
        return bulkItems.mutateAsync({
            prescriptionId: prescriptionInfo.id,
            items
        });
    };

    const finalizePrescriptionAction = () => {
        return finalizePrescription.mutateAsync({
            prescriptionId: prescriptionInfo.id
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
                history.push('/turning', {
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

    const [isServicesOfDoctors, setIsServicesOfDoctors] = useState(false);

    useEffect(() => {
        setIsServicesOfDoctors(
            prescriptionInfo.insuranceType === 'salamat' &&
                !isEmpty(services.filter(item => item.service_type === 5))
        );
    }, [services]);

    const submitServices = async () => {
        // return console.log(services);
        // console.log(isServicesOfDoctors);
        insurances.remove();

        // return;
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
                        use_time,
                        active_from
                    }) => ({
                        brand,
                        count,
                        date_do,
                        description,
                        how_to_use,
                        id: service.id,
                        number_of_period,
                        prescription_id,
                        use_instruction,
                        use_time,
                        active_from
                    })
                );
            const { items } = await addItemToPrescription(servicesWithOutNullItem);

            if (!prescriptionInfo.finalized) {
                const data = await finalizePrescriptionAction();

                sendEvent('sucsessfulPrescribe', 'prescription', 'sucsessfulPrescribe');
                if (isServicesOfDoctors) {
                    setPrescriptionInfo(data);
                    return setDeliverConfirmModal(true);
                }
                if (isEmpty(backPage)) {
                    history.push('/turning', {
                        prescriptionInfo: data
                    });
                } else {
                    history.push('/consult/', {
                        room_id: urlParams.room_id
                    });
                }
            } else {
                if (isServicesOfDoctors) {
                    return setDeliverConfirmModal(true);
                }
                if (isEmpty(backPage)) {
                    history.push('/turning');
                }
                !toast.isActive('finalizePrescription') &&
                    toast.success('نسخه ویرایش شد.', {
                        toastId: 'finalizePrescription'
                    });
            }
        } catch (error) {
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
                    onClick={submitServices}
                    loading={finalizePrescription.isLoading || bulkItems.isLoading}
                >
                    ویرایش
                </Button>
            )}
            {!prescriptionInfo.finalized && (
                <Button
                    size="small"
                    className={styles.button}
                    onClick={submitServices}
                    loading={finalizePrescription.isLoading || bulkItems.isLoading}
                >
                    نهایی سازی نسخه
                </Button>
            )}

            <Modal title="ویزیت" isOpen={visitModal} onClose={setVisitModal}>
                <span className="font-medium">
                    در نسخه آیتمی وجود ندارد، آیا می خواهید ویزیت ثبت کنید؟
                </span>
                {prescriptionInfo.insuranceType === 'tamin' && (
                    <TextArea ref={visitDescription} label="توضیحات ویزیت (اختیاری)" />
                )}
                <div className="flex space-s-2">
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
                <div className="flex space-s-2">
                    <Button block variant="primary" onClick={openDeliverInfo}>
                        بله
                    </Button>
                    <Button block variant="secondary" onClick={() => setDeliverConfirmModal(false)}>
                        خیر
                    </Button>
                </div>
            </Modal>

            <DeliverCase
                isOpen={deliverModal}
                onClose={setDeliverModal}
                trackingCode={prescriptionInfo?.salamat_prescription?.trackingCode}
                nationalCode={prescriptionInfo?.patientNationalCode}
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
