import styles from './Info.module.scss';
import Button from '../../../core/button';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import ReactTooltip from 'react-tooltip';
import { ChevronIcon, EditIcon, PrescriptionIcon } from '../../../icons';
import { useEffect, useState } from 'react';
import Finalize from '../finalize';
import Modal from '../../../core/modal';
import TextField from '../../../core/textField';
import { useForm } from 'react-hook-form';
import { usePostFavoritePrescriptions } from '@paziresh24/hooks/prescription';
import { useServices } from '@paziresh24/context/prescription/services-context';
import { useUpdatePrescription } from '@paziresh24/hooks/prescription/types';
import { useTemplateItem } from '@paziresh24/context/prescription/templateItem.context';
import { Default, Mobile } from '@paziresh24/hooks/device';
import isEmpty from 'lodash/isEmpty';
import { toast } from 'react-toastify';
import { toEnglishNumber } from '@paziresh24/utils';

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
                patientCell: toEnglishNumber(data.patientCell)
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
                            <ReactTooltip id="toggleMore" place="top" type="dark" effect="solid">
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
                            <span className={styles['title']}>نام بیمار:</span>
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
                        <div
                            className={styles['row']}
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
                    </Default>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            width: '5rem',
                            height: '5rem'
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
                                از این قسمت میتوانید آن را جزو نسخ پر استفاده خود ذخیره کنید <br />
                                تا برای بیمار بعدی، بتوانید کل این نسخه را فقط با یک کلیک صادر کنید.
                            </p>
                        </ReactTooltip>
                    </div>
                    <Finalize />
                </div>
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
            {isOpen && (
                <div className={styles.moreInfoWrapper}>
                    <Mobile>
                        <div className={styles.baseInfo}>
                            <div className={styles.col} style={{ width: '100%' }}>
                                <span className={styles['title']}>نام بیمار:</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData.name +
                                        ' ' +
                                        prescriptionInfo.patientAdditionalData.lastName}
                                </span>
                            </div>
                            <div className={styles.col} style={{ width: '100%' }}>
                                <span className={styles['title']}>بیمه:</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData.issuerType ?? '-'}
                                </span>
                            </div>
                            <div
                                className={styles.col}
                                id="p_cell"
                                onClick={() => {
                                    setUpdateCellPhoneModal(true);
                                }}
                                style={{ width: '100%' }}
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
                        </div>
                    </Mobile>
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
                                {prescriptionInfo.patientAdditionalData?.familyPhysician ?? 'ندارد'}
                            </span>
                        </div>
                    </div>
                    <div className={styles['row']}>
                        <div className={styles['col']} data-tip data-for="geoInfo">
                            <span className={styles['title']}>محل تولد</span>
                            <span className={styles['value']}>
                                {prescriptionInfo.patientAdditionalData?.geoInfo ?? '-'}
                            </span>
                            <ReactTooltip id="geoInfo" place="top" type="dark" effect="solid">
                                {prescriptionInfo.patientAdditionalData?.geoInfo ?? '-'}
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
                    </div>
                    {prescriptionInfo.insuranceType === 'salamat' && prescriptionInfo.finalized && (
                        <div className={styles['row']}>
                            <div className={styles['col']} data-tip data-for="geoInfo">
                                <span className={styles['title']}>کد پیگیری</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.salamat_prescription?.trackingCode ?? '-'}
                                </span>
                            </div>
                            <div className={styles['col']}>
                                <span className={styles['title']}>کد توالی</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.salamat_prescription?.sequenceNumber ?? '-'}
                                </span>
                            </div>
                        </div>
                    )}
                    <div className={styles['row']}>
                        {prescriptionInfo.patientAdditionalData?.specialAccount && (
                            <div className={styles['col']}>
                                <span className={styles['title']}>بیماری خاص</span>
                                <span className={styles['value']}>
                                    {prescriptionInfo.patientAdditionalData?.specialAccount ?? '-'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Info;
