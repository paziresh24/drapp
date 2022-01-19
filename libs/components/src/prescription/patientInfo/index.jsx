import styles from './patientInfo.module.scss';
import styled from 'styled-components';
import { sendEvent } from '@paziresh24/utils';
import Button from '../../core/button';
import Modal from '../../core/modal';
import TextField from '../../core/textField';
import { useState } from 'react';
import { useServices } from '@paziresh24/context/prescription/services-context';
import { useBulkItems, useUpdatePrescription } from '@paziresh24/hooks/prescription/types';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import MaleProfile from '../../../assets/image/male.png';
import { useFinalizePrescription } from '../../../hooks/prescription';
import { toast } from 'react-toastify';
import FixedWrapBottom from '../fixedWrapBottom';
import { useBackPage } from '../../../context/core/backPage';
import isEmpty from 'lodash/isEmpty';
import { toastType } from '@paziresh24/constants/prescription.json';
import { EditIcon } from '../../icons';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useDiagnosis } from '@paziresh24/context/prescription/diagnosis-context';
import { DeliverCase } from '../../prescription/deliver/deliverCase';
import ReactTooltip from 'react-tooltip';
import { useLocation } from 'react-router';
import queryString from 'query-string';
import { useLearnTour } from '@paziresh24/hooks/learn';

const Image = styled.div`
    background-image: url(${props => props.image ?? MaleProfile});
`;

const PatientInfo = ({
    data,
    patientCell,
    patientNationalCode,
    createdAt,
    trackingCode,
    sequenceNumber,
    provider
}) => {
    const [prescriptionInfo, setPrescriptionInfo] = useSelectPrescription();
    const [services] = useServices();
    const bulkItems = useBulkItems();
    const finalizePrescription = useFinalizePrescription();
    const [backPage] = useBackPage();
    const updatePrescription = useUpdatePrescription();
    const [cellPhone, setCellPhone] = useState();
    const [deliverConfirmModal, setDeliverConfirmModal] = useState(false);
    const [updateCellPhone, setUpdateCellPhone] = useState(null);
    const [deliverModal, setDeliverModal] = useState(false);
    const [detailsModal, setDetailsModal] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    useEffect(() => {
        if (!isEmpty(prescriptionInfo)) {
            setCellPhone(prescriptionInfo?.cellPhoneNumber ?? prescriptionInfo?.patientCell);
        }
    }, [prescriptionInfo]);

    const closeCellUpdate = () => {
        setUpdateCellPhone(false);
        setSteps(29);
    };

    const updateCellPhoneAction = data => {
        updatePrescription.mutate(
            {
                prescriptionId: prescriptionInfo.id,
                ...data
            },
            {
                onSuccess: () => {
                    closeCellUpdate(false);
                    setCellPhone(data.patientCell);
                },
                onError: error => {
                    toast.error(error.response.data.message);
                }
            }
        );
    };

    const [diagnosis] = useDiagnosis();

    const submitServices = () => {
        if (diagnosis?.id) {
            updatePrescription.mutate({
                prescriptionId: prescriptionInfo.id,
                diagnosis: diagnosis.name,
                who_stem_id: diagnosis.id
            });
        }
        const isServicesOfDoctors = !isEmpty(
            services.filter(item => item.isServicesOfDoctors === true)
        );
        bulkItems.mutate(
            {
                prescriptionId: prescriptionInfo.id,
                items: services
                    .filter(item => item.item_id !== null)
                    .map(service => ({
                        ...service,
                        id: service.item_id
                    }))
            },
            {
                onSuccess: () => {
                    if (!prescriptionInfo.finalized) {
                        finalizePrescription.mutate(
                            {
                                prescriptionId: prescriptionInfo.id
                            },
                            {
                                onSuccess: data => {
                                    sendEvent(
                                        'sucsessfulPrescribe',
                                        'prescription',
                                        'sucsessfulPrescribe'
                                    );
                                    if (isServicesOfDoctors) {
                                        setPrescriptionInfo(data);
                                        return setDeliverConfirmModal(true);
                                    }
                                    if (isEmpty(backPage)) {
                                        window.parent.postMessage(
                                            {
                                                drappEvent: ['backToTurning', 'successFinalize'],
                                                prescriptionInfo: data
                                            },
                                            '*'
                                        );
                                    } else {
                                        window.parent.postMessage(
                                            {
                                                drappEvent: {
                                                    action: 'BACK_PAGE',
                                                    page: backPage
                                                }
                                            },
                                            '*'
                                        );
                                    }
                                },
                                onError: error => {
                                    !toast.isActive('finalizePrescription') &&
                                        toast.error(error.response.data.message, {
                                            toastId: 'finalizePrescription'
                                        });
                                }
                            }
                        );
                    } else {
                        if (isServicesOfDoctors) {
                            return setDeliverConfirmModal(true);
                        }
                        !toast.isActive('finalizePrescription') &&
                            toast.success('نسخه ویرایش شد.', {
                                toastId: 'finalizePrescription'
                            });
                    }
                },
                onError: error => {
                    if (error.response.data.messages) {
                        !isEmpty(error.response.data.messages) &&
                            error.response.data?.messages.map(item => {
                                toast[toastType[item.type]](item.text);
                            });
                        isEmpty(error.response.data.messages) &&
                            !toast.isActive('sendOtherItem') &&
                            toast.error('خطا', {
                                toastId: 'sendOtherItem'
                            });
                    } else {
                        !toast.isActive('sendOtherItem') &&
                            toast.error(error.response.data.message, {
                                toastId: 'sendOtherItem'
                            });
                    }
                }
            }
        );
    };

    const openDeliverInfo = () => {
        setDeliverConfirmModal(false);
        setDeliverModal(true);
        // deliverPrescriptionPrice.refetch();
    };

    const { search: query } = useLocation();
    const urlParams = queryString.parse(query);

    const { isTourOpen, setSteps, isActiveLearn } = useLearnTour();

    useEffect(() => {
        if (isActiveLearn) {
            setSteps(28);
        }
    }, []);

    return (
        <div className={styles['wrapper']} id="p_info">
            <div>
                <div className={styles['info']}>
                    {isEmpty(prescriptionInfo) && (
                        <div className="skeleton-wrapper">
                            <div className="skeleton-row">
                                <div
                                    className="skeleton-square"
                                    style={{ maxWidth: '8rem', height: '8rem' }}
                                />
                                <div className="skeleton-col">
                                    <div className="skeleton" style={{ width: '50%' }} />
                                    <div className="skeleton" style={{ width: '40%' }} />
                                    <div className="skeleton" style={{ width: '70%' }} />
                                </div>
                            </div>
                            <div
                                className={['skeleton-col', styles['more-info']].join(' ')}
                                style={{ marginTop: '4rem', gap: '1rem' }}
                            >
                                <div className="skeleton" style={{ width: '50%' }} />
                                <div className="skeleton" style={{ width: '40%' }} />
                                <div className="skeleton" style={{ width: '70%' }} />
                                <div className="skeleton" style={{ width: '50%' }} />
                                <div className="skeleton" style={{ width: '40%' }} />
                                <div className="skeleton" style={{ width: '70%' }} />
                            </div>
                        </div>
                    )}

                    {!isEmpty(prescriptionInfo) && (
                        <>
                            <Image
                                image={prescriptionInfo.patientAdditionalData?.memberImage}
                                className={styles['image']}
                            />

                            <div className={styles['main']}>
                                <div className={styles['row']}>
                                    <span className={styles['value']}>
                                        {prescriptionInfo.patientAdditionalData.name +
                                            ' ' +
                                            prescriptionInfo.patientAdditionalData.lastName}
                                    </span>
                                </div>
                                <div className={styles['row']}>
                                    <span className={styles['title']}>سن</span>
                                    <span className={styles['value']}>
                                        {prescriptionInfo.patientAdditionalData.age ?? '-'}
                                    </span>
                                </div>
                                <div className={styles['row']}>
                                    <span className={styles['title']}>بیمه</span>
                                    <span className={styles['value']}>
                                        {prescriptionInfo.patientAdditionalData.issuerType ?? '-'}
                                    </span>
                                </div>
                            </div>
                            <button
                                className={styles.showMore}
                                onClick={() => setDetailsModal(true)}
                            >
                                اطلاعات بیشتر
                            </button>
                        </>
                    )}
                </div>
                {!isEmpty(prescriptionInfo) && (
                    <div
                        className={[styles['main'], styles['more-info']].join(' ')}
                        style={{ marginRight: 0, marginTop: '1rem', lineHeight: '3rem' }}
                    >
                        <div className={styles['row']}>
                            <div className={styles['col']}>
                                <span className={styles['title']}>جنسیت</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData?.gender ?? '-'}
                                </span>
                            </div>
                        </div>
                        <div className={styles['row']}>
                            <div className={styles['col']}>
                                <span className={styles['title']}>تاریخ تولد</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData?.birthDate ?? '-'}
                                </span>
                            </div>
                        </div>
                        <div className={styles['row']}>
                            <div className={styles['col']}>
                                <span className={styles['title']}>اعتبار بیمه</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData?.accountValidto ?? '-'}
                                </span>
                            </div>
                        </div>
                        {prescriptionInfo.patientAdditionalData?.productId && (
                            <div className={styles['row']}>
                                <span className={styles['title']}>صندوق بیمه</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData?.productId ?? '-'}
                                </span>
                            </div>
                        )}
                        <div className={styles['row']}>
                            <div className={styles['col']}>
                                <span className={styles['title']}>کدملی</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientNationalCode ?? '-'}
                                </span>
                            </div>
                        </div>
                        <div className={styles['row']}>
                            <div className={styles['col']}>
                                <span className={styles['title']}>پزشک خانواده</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData?.familyPhysician ??
                                        'ندارد'}
                                </span>
                            </div>
                        </div>
                        <div className={styles['row']}>
                            <div className={styles['col']}>
                                <span className={styles['title']}>وضعیت تاهل</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData?.maritalStatus ?? '-'}
                                </span>
                            </div>
                        </div>
                        <div className={styles['row']}>
                            <div className={styles['col']}>
                                <span className={styles['title']}>تاریخ ثبت</span>
                                <span className={styles['value']}>
                                    {new Date(prescriptionInfo.created_at).toLocaleDateString(
                                        'fa-IR'
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className={styles['row']} id="p_cell">
                            <div
                                className={styles['col']}
                                onClick={() => {
                                    setUpdateCellPhone(true);
                                    setSteps(30);
                                }}
                                style={{ cursor: 'pointer' }}
                                aria-hidden
                                data-tip
                                data-for="editPhone"
                            >
                                <span className={styles['title']}>شماره موبایل</span>
                                <span className={styles['value']}>{cellPhone}</span>
                                <EditIcon />
                            </div>
                            <ReactTooltip id="editPhone" place="top" type="dark" effect="solid">
                                شماره موبایلی که پیامک ثبت نسخه برای آن ارسال می شود
                            </ReactTooltip>
                        </div>
                        {prescriptionInfo.patientAdditionalData?.specialAccount && (
                            <div className={styles['row']}>
                                <span className={styles['title']}>بیماری خاص</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData?.specialAccount ?? '-'}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {!isEmpty(prescriptionInfo) && (
                <Modal title="اطلاعات بیمار" isOpen={detailsModal} onClose={setDetailsModal}>
                    <div className={styles['patientInfo__modal-wrapper']}>
                        <div className={styles['row']}>
                            <div className={styles['col']}>
                                <span className={styles['title']}>نام</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData?.name}
                                </span>
                            </div>
                            <div className={styles['col']}>
                                <span className={styles['title']}>نام خانوادگی</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData?.lastName}
                                </span>
                            </div>
                        </div>
                        <div className={styles['row']}>
                            <div className={styles['col']}>
                                <span className={styles['title']}>سن</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData?.age ?? '-'}
                                </span>
                            </div>
                            <div className={styles['col']}>
                                <span className={styles['title']}>نسبت با سرپرست</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData?.relationType ?? '-'}
                                </span>
                            </div>
                        </div>
                        <div className={styles['row']}>
                            <div className={styles['col']}>
                                <span className={styles['title']}>جنسیت</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData?.gender ?? '-'}
                                </span>
                            </div>
                            <div className={styles['col']}>
                                <span className={styles['title']}>تاریخ تولد</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData?.birthDate ?? '-'}
                                </span>
                            </div>
                        </div>
                        <div className={styles['row']}>
                            <div className={styles['col']}>
                                <span className={styles['title']}>اعتبار بیمه</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData?.accountValidto ?? '-'}
                                </span>
                            </div>
                            <div className={styles['col']}>
                                <span className={styles['title']}>کدملی</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientNationalCode ?? '-'}
                                </span>
                            </div>
                        </div>

                        <div className={styles['row']}>
                            <div className={styles['col']}>
                                <span className={styles['title']}>وضعیت تاهل</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData?.maritalStatus ?? '-'}
                                </span>
                            </div>
                            <div className={styles['col']}>
                                <span className={styles['title']}>پزشک خانواده</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData?.familyPhysician ??
                                        'ندارد'}
                                </span>
                            </div>
                        </div>
                        <div className={styles['row']}>
                            <div
                                className={styles['col']}
                                onClick={() => setUpdateCellPhone(true)}
                                style={{ cursor: 'pointer', width: '100%' }}
                                aria-hidden
                            >
                                <span className={styles['title']}>شماره موبایل</span>
                                <span className={styles['value']}>{cellPhone}</span>
                                <EditIcon />
                            </div>
                        </div>
                        {prescriptionInfo.patientAdditionalData?.productId && (
                            <div className={styles['row']}>
                                <span className={styles['title']}>صندوق بیمه</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData?.productId ?? '-'}
                                </span>
                            </div>
                        )}
                        {prescriptionInfo.patientAdditionalData?.specialAccount && (
                            <div className={styles['row']}>
                                <span className={styles['title']}>بیماری خاص</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData?.specialAccount ?? '-'}
                                </span>
                            </div>
                        )}
                        <div className={styles['row']}>
                            <span className={styles['title']}>محل تولد</span>
                            <span className={styles['value']}>
                                {prescriptionInfo.patientAdditionalData?.geoInfo ?? '-'}
                            </span>
                        </div>
                    </div>
                </Modal>
            )}
            {isEmpty(prescriptionInfo) && (
                <FixedWrapBottom>
                    <div className="skeleton-wrapper">
                        <div
                            className="skeleton-square"
                            style={{
                                maxWidth: '100%',
                                height: '5rem',
                                margin: '0'
                            }}
                        />
                    </div>
                </FixedWrapBottom>
            )}

            {!isEmpty(prescriptionInfo) && !prescriptionInfo.finalized && (
                <FixedWrapBottom>
                    <Button
                        block
                        id="submitServices"
                        onClick={submitServices}
                        loading={finalizePrescription.isLoading || bulkItems.isLoading}
                    >
                        ثبت نسخه
                    </Button>
                </FixedWrapBottom>
            )}

            {!isEmpty(prescriptionInfo) &&
                prescriptionInfo.finalized &&
                services.some(item => item.isServicesOfDoctors === true) && (
                    <FixedWrapBottom>
                        <Button
                            block
                            id="submitServices"
                            onClick={() => setDeliverConfirmModal(true)}
                        >
                            ارائه نسخه
                        </Button>
                    </FixedWrapBottom>
                )}

            <Modal
                title="ویرایش شماره موبایل"
                isOpen={updateCellPhone}
                onClose={closeCellUpdate}
                id="cell_edit_step"
            >
                <form
                    className={styles['updateCellPhone-wrapper']}
                    onSubmit={handleSubmit(updateCellPhoneAction)}
                >
                    <TextField
                        label="شماره موبایل"
                        error={errors.patientCell}
                        defaultValue={cellPhone}
                        {...register('patientCell', { required: true })}
                        style={{ direction: 'ltr' }}
                        type="tel"
                    />
                    <Button block type="submit" loading={updatePrescription.isLoading}>
                        ویرایش
                    </Button>
                </form>
            </Modal>
            <Modal
                title="آیا میخواهید خدمات در مطب ارائه نمائید؟"
                isOpen={deliverConfirmModal}
                onClose={setDeliverConfirmModal}
            >
                <div className={styles['confirmModal-row']}>
                    <Button block variant="primary" onClick={openDeliverInfo}>
                        بله
                    </Button>
                    <Button block variant="secondary" onClick={() => setDeliverConfirmModal(false)}>
                        خیر
                    </Button>
                </div>
            </Modal>
            {!isEmpty(prescriptionInfo) && (
                <DeliverCase
                    isOpen={deliverModal}
                    onClose={setDeliverModal}
                    trackingCode={prescriptionInfo?.salamat_prescription?.trackingCode}
                    nationalCode={prescriptionInfo?.patientNationalCode}
                />
            )}
        </div>
    );
};

export { PatientInfo };
