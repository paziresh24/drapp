import styles from './Info.module.scss';
import Button from '@paziresh24/shared/ui/button';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import ReactTooltip from 'react-tooltip';
import { ChevronIcon, EditIcon, PrescriptionIcon } from '@paziresh24/shared/icon';
import { useEffect, useState } from 'react';
import Finalize from '../finalize';
import Modal from '@paziresh24/shared/ui/modal';
import TextField from '@paziresh24/shared/ui/textField';
import { useForm } from 'react-hook-form';
import { usePostFavoritePrescriptions } from '@paziresh24/hooks/prescription';
import { useServices } from '@paziresh24/context/prescription/services-context';
import { useUpdatePrescription } from '@paziresh24/hooks/prescription/types';
import { useTemplateItem } from '@paziresh24/context/prescription/templateItem.context';
import { Default, Mobile } from '@paziresh24/hooks/device';
import isEmpty from 'lodash/isEmpty';
import { toast } from 'react-toastify';
import { digitsFaToEn } from '@paziresh24/utils';

const Info = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [prescriptionInfo] = useSelectPrescription();
    const [cellPhone, setCellPhone] = useState();
    const [favoriteFolderNameModal, setFavoriteFolderNameModal] = useState(false);
    const [updateCellPhoneModal, setUpdateCellPhoneModal] = useState(false);
    const postFavoritePrescriptions = usePostFavoritePrescriptions();
    const updatePrescription = useUpdatePrescription();
    const [services] = useServices();
    const [, setTemplateItem] = useTemplateItem();

    useEffect(() => {
        if (!isEmpty(prescriptionInfo)) {
            setCellPhone(prescriptionInfo?.cellPhoneNumber ?? prescriptionInfo?.patientCell);
        }
    }, [prescriptionInfo]);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const {
        register: updatePrescriptionRegister,
        handleSubmit: updatePrescriptionHandleSubmit,
        formState: { errors: updatePrescriptionErrors }
    } = useForm();

    const addFavoritePrescriptions = data => {
        postFavoritePrescriptions.mutate(
            {
                name: data.name,
                [prescriptionInfo.insuranceType + 'Items']: services.filter(
                    item => item.item_id !== null
                )
            },
            {
                onSuccess: data => {
                    setFavoriteFolderNameModal(false);
                    setTemplateItem(prev => [...prev, data]);
                }
            }
        );
    };

    const updateCellPhoneAction = data => {
        updatePrescription.mutate(
            {
                prescriptionId: prescriptionInfo.id,
                patientCell: digitsFaToEn(data.patientCell)
            },
            {
                onSuccess: () => {
                    setUpdateCellPhoneModal(false);
                    setCellPhone(data.patientCell);
                },
                onError: error => {
                    toast.error(error.response.data.message);
                }
            }
        );
    };

    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.topBar}>
                    <div className={styles.infoDetails}>
                        <div
                            onClick={() => setIsOpen(prev => !prev)}
                            aria-hidden
                            className={styles.toggleMore}
                            data-tip
                            data-for="toggleMore"
                        >
                            <ChevronIcon dir={isOpen ? 'top' : 'bottom'} />

                            {!isOpen && (
                                <ReactTooltip
                                    id="toggleMore"
                                    place="top"
                                    type="dark"
                                    effect="solid"
                                >
                                    اطلاعات بیشتر بیمار
                                </ReactTooltip>
                            )}
                        </div>
                        <Mobile>
                            <span className={styles.patientName}>
                                {prescriptionInfo.patientAdditionalData.name +
                                    ' ' +
                                    prescriptionInfo.patientAdditionalData.lastName}
                            </span>
                        </Mobile>

                        <Default>
                            <div className={styles.row}>
                                {/* <span className={styles['title']}>نام بیمار:</span> */}
                                {prescriptionInfo.patientAdditionalData?.gender === 'زن' ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M8.20094 13.3872L5.42786 12.0508C5.42786 12.0508 6.12948 11.1487 6.26312 6.1371L6.24085 6.73849C6.24085 3.47538 8.88029 0.835938 12.1434 0.835938C15.4065 0.835938 18.046 3.47538 18.046 6.73849L18.0125 6.12596C18.135 11.1376 18.8367 12.0396 18.8367 12.0396L16.0636 13.3761"
                                            stroke="#2b2f33"
                                            strokeWidth="1.5"
                                            strokeMiterlimit="10"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M3.25 21C3.25 21.4142 3.58579 21.75 4 21.75C4.41421 21.75 4.75 21.4142 4.75 21L3.25 21ZM19.25 21C19.25 21.4142 19.5858 21.75 20 21.75C20.4142 21.75 20.75 21.4142 20.75 21L19.25 21ZM4.75 21C4.75 19.9966 4.95288 19.2731 5.27209 18.7402C5.58887 18.2113 6.05265 17.8157 6.66876 17.5188C7.94488 16.9038 9.78439 16.75 12 16.75L12 15.25C9.79733 15.25 7.63684 15.3871 6.01753 16.1675C5.18592 16.5683 4.47813 17.1466 3.98527 17.9694C3.49483 18.7882 3.25 19.7943 3.25 21L4.75 21ZM12 16.75C14.2156 16.75 16.0551 16.9038 17.3312 17.5188C17.9473 17.8157 18.4111 18.2113 18.7279 18.7402C19.0471 19.2731 19.25 19.9966 19.25 21L20.75 21C20.75 19.7943 20.5052 18.7882 20.0147 17.9694C19.5219 17.1466 18.8141 16.5683 17.9825 16.1675C16.3632 15.3871 14.2027 15.25 12 15.25L12 16.75Z"
                                            fill="#2b2f33"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M17.1996 0.835938C16.8209 0.847074 16.0079 3.6313 13.3128 2.71807L11.8761 1.93849C9.04737 0.824801 7.065 2.28373 7.065 5.06796V8.30879C7.065 11.093 9.34806 13.3761 12.1323 13.3761C14.9165 13.3761 17.1996 11.093 17.1996 8.30879V1.13663"
                                            stroke="#2b2f33"
                                            strokeWidth="1.5"
                                            strokeMiterlimit="10"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M3.25 21C3.25 21.4142 3.58579 21.75 4 21.75C4.41421 21.75 4.75 21.4142 4.75 21L3.25 21ZM19.25 21C19.25 21.4142 19.5858 21.75 20 21.75C20.4142 21.75 20.75 21.4142 20.75 21L19.25 21ZM4.75 21C4.75 19.9966 4.95288 19.2731 5.27209 18.7402C5.58887 18.2113 6.05265 17.8157 6.66876 17.5188C7.94488 16.9038 9.78439 16.75 12 16.75L12 15.25C9.79733 15.25 7.63684 15.3871 6.01753 16.1675C5.18592 16.5683 4.47813 17.1466 3.98527 17.9694C3.49483 18.7882 3.25 19.7943 3.25 21L4.75 21ZM12 16.75C14.2156 16.75 16.0551 16.9038 17.3312 17.5188C17.9473 17.8157 18.4111 18.2113 18.7279 18.7402C19.0471 19.2731 19.25 19.9966 19.25 21L20.75 21C20.75 19.7943 20.5052 18.7882 20.0147 17.9694C19.5219 17.1466 18.8141 16.5683 17.9825 16.1675C16.3632 15.3871 14.2027 15.25 12 15.25L12 16.75Z"
                                            fill="#2b2f33"
                                        />
                                    </svg>
                                )}
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData.name +
                                        ' ' +
                                        prescriptionInfo.patientAdditionalData.lastName}
                                </span>
                            </div>
                            <div className={styles.row}>
                                <span className={styles['title']}>بیمه:</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData.issuerType ?? '-'}
                                </span>
                            </div>
                        </Default>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                width: '3.5rem',
                                height: '3.5rem'
                            }}
                            onClick={() => setFavoriteFolderNameModal(true)}
                            aria-hidden
                            data-tip
                            data-for="template"
                        >
                            <PrescriptionIcon />
                            <ReactTooltip id="template" place="top" type="dark" effect="solid">
                                <p>
                                    بعد از اینکه نسخه را کامل کردید، <br />
                                    از این قسمت میتوانید آن را جزو نسخ پر استفاده خود ذخیره کنید{' '}
                                    <br />
                                    تا برای بیمار بعدی، بتوانید کل این نسخه را فقط با یک کلیک صادر
                                    کنید.
                                </p>
                            </ReactTooltip>
                        </div>
                        <Finalize />
                    </div>
                </div>

                {isOpen && (
                    <div className={styles.moreInfoWrapper}>
                        <Mobile>
                            <div className={styles.col} style={{ width: '100%' }}>
                                <span className={styles['title']}>بیمه:</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData.issuerType ?? '-'}
                                </span>
                            </div>
                        </Mobile>
                        <Default></Default>
                        <div className={styles['col']}>
                            <span className={styles['title']}>سن</span>
                            <span className={styles['value']}>
                                {prescriptionInfo.patientAdditionalData?.age ?? '-'}
                            </span>
                        </div>
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
                        <div
                            className={styles['col']}
                            id="p_cell"
                            onClick={() => {
                                setUpdateCellPhoneModal(true);
                            }}
                            style={{ cursor: 'pointer' }}
                            aria-hidden
                            data-tip
                            data-for="editPhone"
                        >
                            <span className={styles['title']}>شماره موبایل: </span>
                            <span className={styles['value']}>{cellPhone}</span>
                            <EditIcon />
                            <ReactTooltip id="editPhone" place="top" type="dark" effect="solid">
                                شماره موبایلی که پیامک ثبت نسخه برای آن ارسال می شود
                            </ReactTooltip>
                        </div>

                        {prescriptionInfo.patientAdditionalData?.productId && (
                            <div className={styles['col']}>
                                <span className={styles['title']}>صندوق بیمه</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData?.productId ?? '-'}
                                </span>
                            </div>
                        )}
                        {prescriptionInfo.insuranceType === 'salamat' &&
                            prescriptionInfo.finalized && (
                                <>
                                    <div className={styles['col']} data-tip data-for="geoInfo">
                                        <span className={styles['title']}>کد پیگیری</span>
                                        <span className={styles['value']}>
                                            {prescriptionInfo.salamat_prescription?.trackingCode ??
                                                '-'}
                                        </span>
                                    </div>
                                    <div className={styles['col']}>
                                        <span className={styles['title']}>کد توالی</span>
                                        <span className={styles['value']}>
                                            {prescriptionInfo.salamat_prescription
                                                ?.sequenceNumber ?? '-'}
                                        </span>
                                    </div>
                                </>
                            )}
                        {prescriptionInfo.patientAdditionalData?.specialAccount && (
                            <div className={styles['col']}>
                                <span className={styles['title']}>بیماری خاص</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData?.specialAccount ?? '-'}
                                </span>
                            </div>
                        )}
                    </div>
                )}
                <Modal
                    title="نسخه پراستفاده"
                    isOpen={favoriteFolderNameModal}
                    onClose={setFavoriteFolderNameModal}
                    id="name_template_button_step"
                >
                    <form
                        onSubmit={handleSubmit(addFavoritePrescriptions)}
                        className={styles.formWrapper}
                    >
                        <TextField
                            label="نام نسخه"
                            name="name"
                            error={errors.name}
                            {...register('name', {
                                required: true
                            })}
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            block
                            loading={postFavoritePrescriptions.isLoading}
                        >
                            تایید
                        </Button>
                    </form>
                </Modal>

                <Modal
                    title="ویرایش شماره موبایل"
                    isOpen={updateCellPhoneModal}
                    onClose={setUpdateCellPhoneModal}
                    id="cell_edit_step"
                >
                    <form
                        className={styles.formWrapper}
                        onSubmit={updatePrescriptionHandleSubmit(updateCellPhoneAction)}
                    >
                        <TextField
                            label="شماره موبایل"
                            error={updatePrescriptionErrors.patientCell}
                            defaultValue={cellPhone}
                            {...updatePrescriptionRegister('patientCell', { required: true })}
                            style={{ direction: 'ltr' }}
                            type="tel"
                        />
                        <Button block type="submit" loading={updatePrescription.isLoading}>
                            ویرایش
                        </Button>
                    </form>
                </Modal>
            </div>
        </>
    );
};

export default Info;
