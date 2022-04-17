import { useHistory, useLocation } from 'react-router-dom';
import Button from '@paziresh24/shared/ui/button';
import styles from './turnCard.module.scss';
import moment from 'jalali-moment';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import Modal from '@paziresh24/shared/ui/modal';
import TextField from '@paziresh24/shared/ui/textField';
import { useForm } from 'react-hook-form';
import { sendEvent } from '@paziresh24/utils';
import { ChevronIcon, PrintIcon, RemoveIcon } from '@paziresh24/shared/icon';
import Chips from '@paziresh24/shared/ui/chips';
import { createRef } from 'react';
import {
    useCheckOtp,
    useDeletePrescription,
    useGetOnePrescription
} from '@paziresh24/hooks/prescription';
import { toast } from 'react-toastify';
import { useDrApp } from '@paziresh24/context/drapp/index';
import ReactTooltip from 'react-tooltip';
import Visit from '../visit';
import { Default, Mobile } from '@paziresh24/hooks/core/device';
import queryString from 'query-string';
import { useTour } from '@reactour/tour';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

const PrescriptionCard = ({
    dropDownShowKey,
    turn,
    refetchData,
    dropDownShow,
    setDropDownShow
}) => {
    const { search } = useLocation();

    const [info] = useDrApp();
    const history = useHistory();
    const linkClick = createRef();
    const [pdfLink, setPdfLink] = useState();
    const [deletePrescriptionModal, setDeletePrescriptionModal] = useState(false);
    const deletePrescription = useDeletePrescription();

    const checkOtp = useCheckOtp();
    const [otpConfirm, setOtpConfirm] = useState(false);
    const [visitModal, setVisitModal] = useState(false);
    const { setIsOpen: tourState, setCurrentStep: setSteps } = useTour();
    const getOnePrescription = useGetOnePrescription({ id: turn?.id });
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const {
        register: otpRegister,
        handleSubmit: otpHandleSubmit,
        formState: { errors: otpError }
    } = useForm();

    const prescription = () => {
        getSplunkInstance().sendEvent({
            group: 'turning-list',
            type: 'prescription-action'
        });
        window._prescription = { ...turn };
        sendEvent('tajviz', 'prescription', 'tajviz');
        history.push(`/prescription/patient/${turn.id}`, {
            prescriptionInfo: turn
        });
    };

    useEffect(() => {
        if (getOnePrescription.isSuccess) {
            getPdf();
        }
    }, [getOnePrescription.status]);

    const getPdf = () => {
        if (!turn?.pdf && !getOnePrescription?.data?.pdf) {
            getOnePrescription.remove();
            return setTimeout(() => getOnePrescription.refetch(), 0);
        }

        window.open(
            `${
                process.env.NODE_ENV === 'production'
                    ? window.location.hostname === window._env_.P24_MAIN_DOMAIN
                        ? window._env_.P24_BASE_URL_PRESCRIPTION_API
                        : (info.center?.local_base_url ?? window.location.origin) +
                          process.env.REACT_APP_BASE_URL_PRESCRIPTION_ROUTE
                    : window._env_.P24_BASE_URL_PRESCRIPTION_API
            }/pdfs/` + (getOnePrescription?.data?.pdf ?? turn.pdf)
        );
    };

    const deletePrescriptionAction = async () => {
        sendEvent('deletepriscription', 'prescription', 'deletepriscription');

        deletePrescription.mutate(
            { baseURL: info.center.local_base_url, id: turn.id },
            {
                onSuccess: data => {
                    if (data?.message === 'کد تایید دو مرحله‌ای را ارسال کنید') {
                        return setOtpConfirm(true);
                    }
                    refetchData();
                    setDeletePrescriptionModal(false);
                },
                onError: error => {
                    if (error.response.data.message === 'کد تایید دو مرحله‌ای را ارسال کنید') {
                        return setOtpConfirm(true);
                    }
                    setDeletePrescriptionModal(false);

                    !toast.isActive('deletePrescription') &&
                        toast.error(error.response.data.message, {
                            toastId: 'deletePrescription'
                        });
                }
            }
        );
    };

    const otpConfirmAction = data => {
        checkOtp.mutate(
            {
                baseURL: info.center.local_base_url,
                identifier: info.center.id,
                code: data.otpCode
            },
            {
                onSuccess: () => {
                    setOtpConfirm(false);
                },
                onError: err => {
                    if (!toast.isActive('designer_refresh'))
                        toast.error(err.response.data.message, {
                            toastId: ' designer_refresh '
                        });
                }
            }
        );
    };

    useEffect(() => {
        if (
            queryString.parse(search).learnRow &&
            queryString.parse(search).learnRow === turn.identifier
        ) {
            // let stepInterval;
            // stepInterval = setInterval(() => {
            if (document.querySelector(`.row-select`)) {
                tourState(true);
                setSteps(5);
                // setTimeout(() => clearInterval(stepInterval), 0);
            }
            // }, 500);
        }
    }, []);

    return (
        <>
            <Default>
                <tr
                    className={`${turn.finalized ? styles.disabled : ''} ${
                        queryString.parse(search).learnRow === turn.identifier ? 'row-select' : ''
                    }`}
                >
                    <td data-label="نام بیمار:">
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2rem',
                                paddingRight: '0.8rem'
                            }}
                        >
                            {turn.finalized && (
                                <div
                                    onClick={() => setIsDetailsOpen(prev => !prev)}
                                    aria-hidden
                                    style={{ cursor: 'pointer' }}
                                >
                                    <ChevronIcon dir={isDetailsOpen ? 'top' : 'bottom'} />
                                </div>
                            )}

                            {turn?.insuranceType === 'salamat' &&
                                turn?.salamat_prescription?.isReference && (
                                    <Chips theme="gray">ارجاع</Chips>
                                )}

                            <span
                                className={styles.name}
                                onClick={prescription}
                                aria-hidden
                                style={{ cursor: 'pointer' }}
                            >
                                {turn.patientAdditionalData.name +
                                    ' ' +
                                    turn.patientAdditionalData.lastName}
                            </span>
                        </div>
                    </td>
                    <td data-label="شماره موبایل:">
                        <span>{turn.patientCell ?? '-'}</span>
                    </td>
                    <td data-label="وضعیت نسخه:">
                        {turn.finalized ? (
                            <>
                                <span
                                    className={styles.finalized}
                                    data-tip
                                    data-for="finalizedhint"
                                >
                                    ثبت شده
                                </span>
                                <ReactTooltip
                                    id="finalizedhint"
                                    place="top"
                                    type="dark"
                                    effect="solid"
                                >
                                    نسخه ثبت شده است
                                </ReactTooltip>
                            </>
                        ) : turn.status === null ? (
                            <>
                                <span
                                    className={styles.notFinalized}
                                    data-tip
                                    data-for="notFinalized"
                                >
                                    ثبت نشده
                                </span>
                                <ReactTooltip
                                    id="notFinalized"
                                    place="top"
                                    type="dark"
                                    effect="solid"
                                >
                                    نسخه ای هنوز ثبت نشده
                                </ReactTooltip>
                            </>
                        ) : turn?.status === 'FAILED' ? (
                            <span className={styles.notFinalized}>خطا در ثبت</span>
                        ) : (
                            <>
                                <span className={styles.finalizing} data-tip data-for="finalizing">
                                    در صف ثبت
                                </span>
                                <ReactTooltip
                                    id="finalizing"
                                    place="top"
                                    type="dark"
                                    effect="solid"
                                >
                                    نسخه ای که به هر علتی با موفقیت صادر نشده اما در بکگراند برای
                                    ارسال آن درحال اقدام هستیم
                                </ReactTooltip>
                            </>
                        )}
                    </td>
                    <td data-label="بیمه بیمار:">
                        {turn.insuranceType === 'tamin' ? (
                            <span>تامین اجتماعی</span>
                        ) : (
                            <span>سلامت</span>
                        )}
                    </td>
                    <td data-label="زمان نوبت:">
                        <span className={styles['value']}>
                            {moment(new Date(turn.created_at).getTime())
                                .locale('fa')
                                .calendar(null, {
                                    sameDay: '[امروز]',
                                    nextDay: '[فردا]',
                                    nextWeek: 'D MMMM',
                                    lastDay: '[دیروز]',
                                    lastWeek: 'D MMMM',
                                    sameElse: 'D MMMM'
                                })}
                            {' ساعت '}
                            {moment(new Date(turn.created_at).getTime())
                                .locale('fa')
                                .format('HH:mm')}
                        </span>
                    </td>
                    <td className={styles.actionCol}>
                        <div className={styles.buttonAction}>
                            <Button
                                variant="secondary"
                                size="small"
                                disabled={turn.finalized}
                                onClick={() => {
                                    setVisitModal(true);
                                    sendEvent('onlyvisit', 'prescription', 'tajonlyvisitviz');
                                }}
                                style={{ marginLeft: '0.5rem' }}
                            >
                                {turn.finalized ? 'ویزیت شده' : 'ویزیت '}
                            </Button>
                            <Button
                                size="small"
                                icon={<ChevronIcon color="#27bda0" />}
                                variant="secondary"
                                onClick={prescription}
                            >
                                {turn.finalized ? 'مشاهده نسخه' : 'تجویز '}
                            </Button>

                            <div className={styles.action}>
                                <div
                                    className={styles.turn_action}
                                    onClick={e => {
                                        !dropDownShow && e.stopPropagation();
                                        !dropDownShow && setDropDownShow(dropDownShowKey);
                                    }}
                                    aria-hidden
                                >
                                    <svg
                                        width="5"
                                        height="15"
                                        viewBox="0 0 3 13"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <circle cx="1.35281" cy="1.75977" r="1" fill="#3F3F79" />
                                        <circle cx="1.35281" cy="6.75977" r="1" fill="#3F3F79" />
                                        <circle cx="1.35281" cy="11.7598" r="1" fill="#3F3F79" />
                                    </svg>
                                </div>

                                <ul
                                    className={classNames({
                                        [styles['drop-down']]: true,
                                        [styles['show']]: dropDownShow === dropDownShowKey
                                    })}
                                >
                                    {turn.finalized && (
                                        <li onClick={getPdf} aria-hidden>
                                            <PrintIcon />
                                            <span>pdf نسخه</span>
                                        </li>
                                    )}
                                    {!turn.finalized && (
                                        <li
                                            onClick={() => setDeletePrescriptionModal(true)}
                                            aria-hidden
                                        >
                                            <RemoveIcon />
                                            <span>حذف نسخه</span>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </td>
                </tr>
                {isDetailsOpen && (
                    <tr>
                        <td colspan="6" style={{ background: '#EBEFF8', padding: '0.5rem 0' }}>
                            <div
                                className={styles.details}
                                style={{
                                    display: 'flex',
                                    gap: '2rem',
                                    width: '100%',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '0rem'
                                }}
                            >
                                <div className="flex space-s-3">
                                    <span>کدملی</span>
                                    <span>{turn.patientNationalCode ?? '-'}</span>
                                </div>

                                <div className="flex space-s-3">
                                    <span>کد پیگیری</span>
                                    <span>
                                        {turn?.insuranceType === 'tamin' &&
                                            turn.tamin_prescription.map(item => (
                                                <span key={item.head_EPRSC_ID}>
                                                    {item.head_EPRSC_ID ?? '-'}
                                                </span>
                                            ))}
                                        {turn?.insuranceType === 'salamat' && (
                                            <span>
                                                {turn.salamat_prescription?.trackingCode ?? ''}
                                            </span>
                                        )}{' '}
                                    </span>
                                </div>

                                <div className="flex space-s-3">
                                    <span>کد توالی</span>
                                    <span>{turn.salamat_prescription?.sequenceNumber ?? '-'}</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                )}
            </Default>
            <Mobile>
                <div className={styles.card}>
                    <span className="font-medium">
                        {turn.patientAdditionalData.name +
                            ' ' +
                            turn.patientAdditionalData.lastName}
                    </span>
                    <div className={styles.dropDown}>
                        <div
                            className={styles.turn_action}
                            onClick={e => {
                                !dropDownShow && e.stopPropagation();
                                !dropDownShow && setDropDownShow(dropDownShowKey);
                            }}
                            aria-hidden
                        >
                            <svg
                                width="5"
                                height="15"
                                viewBox="0 0 3 13"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle cx="1.35281" cy="1.75977" r="1" fill="#3F3F79" />
                                <circle cx="1.35281" cy="6.75977" r="1" fill="#3F3F79" />
                                <circle cx="1.35281" cy="11.7598" r="1" fill="#3F3F79" />
                            </svg>
                        </div>

                        <ul
                            className={classNames({
                                [styles['drop-down']]: true,
                                [styles['show']]: dropDownShow === dropDownShowKey
                            })}
                        >
                            {turn.finalized && (
                                <li onClick={getPdf} aria-hidden>
                                    <PrintIcon />
                                    <span>pdf نسخه</span>
                                </li>
                            )}
                            {!turn.finalized && (
                                <li onClick={() => setDeletePrescriptionModal(true)} aria-hidden>
                                    <RemoveIcon />
                                    <span>حذف نسخه</span>
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className={styles.patientInfo}>
                        <div className={styles.patientInfoRow}>
                            <div className="w-full">
                                <span>شماره موبایل: </span>
                                <span>{turn.patientCell ?? '-'}</span>
                            </div>
                            <div className="w-full">
                                <span>زمان نوبت: </span>
                                <span>
                                    {moment(new Date(turn.created_at).getTime())
                                        .locale('fa')
                                        .calendar(null, {
                                            sameDay: '[امروز]',
                                            nextDay: '[فردا]',
                                            nextWeek: 'D MMMM',
                                            lastDay: '[دیروز]',
                                            lastWeek: 'D MMMM',
                                            sameElse: 'D MMMM'
                                        })}{' '}
                                    {moment(new Date(turn.created_at).getTime())
                                        .locale('fa')
                                        .format('HH:mm')}
                                </span>
                            </div>
                        </div>
                        <div className={styles.patientInfoRow}>
                            <div className="w-full">
                                <span>کدپیگیری نسخه: </span>
                                <span>
                                    {turn?.insuranceType === 'tamin' &&
                                        turn.tamin_prescription.map(item => (
                                            <span key={item.head_EPRSC_ID}>
                                                {item.head_EPRSC_ID ?? '-'}
                                            </span>
                                        ))}
                                    {turn?.insuranceType === 'salamat' && (
                                        <span>{turn.salamat_prescription?.trackingCode ?? ''}</span>
                                    )}
                                </span>
                            </div>
                            <div className="w-full">
                                <span>وضعیت نسخه: </span>
                                <span>
                                    {turn.finalized ? (
                                        <span data-tip data-for="finalizedhint">
                                            ثبت شده
                                        </span>
                                    ) : turn.status === null ? (
                                        <span data-tip data-for="notFinalized">
                                            ثبت نشده
                                        </span>
                                    ) : turn?.status === 'FAILED' ? (
                                        <span className={styles.notFinalized}>خطا در ثبت</span>
                                    ) : (
                                        <span data-tip data-for="finalizing">
                                            در صف ثبت
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.cardAction}>
                        <Button
                            variant="secondary"
                            size="small"
                            disabled={turn.finalized}
                            block
                            onClick={() => {
                                setVisitModal(true);
                                sendEvent('onlyvisit', 'prescription', 'tajonlyvisitviz');
                            }}
                        >
                            {turn.finalized ? 'ویزیت شده' : 'ویزیت '}
                        </Button>
                        <Button variant="secondary" size="small" block onClick={prescription}>
                            {turn.finalized ? 'مشاهده نسخه' : 'تجویز '}
                        </Button>
                    </div>
                </div>
            </Mobile>
            <Modal
                title="آیا از حذف نسخه مطمئن می باشید؟"
                isOpen={deletePrescriptionModal}
                onClose={setDeletePrescriptionModal}
            >
                <div className={styles['confirmModal-row']}>
                    <Button
                        block
                        variant="primary"
                        theme="error"
                        onClick={deletePrescriptionAction}
                        loading={deletePrescription.isLoading}
                    >
                        بله و حذف
                    </Button>
                    <Button
                        block
                        variant="secondary"
                        theme="error"
                        onClick={() => setDeletePrescriptionModal(false)}
                    >
                        لغو عملیات
                    </Button>
                </div>
            </Modal>
            <Modal
                isOpen={otpConfirm}
                onClose={setOtpConfirm}
                title="کد تایید ارسال شده را وارد نمایید."
            >
                <form
                    className={styles['otp-wrapper']}
                    onSubmit={otpHandleSubmit(otpConfirmAction)}
                >
                    <TextField
                        label="کد تایید"
                        error={otpError.otpCode}
                        {...otpRegister('otpCode', { required: true })}
                        style={{ direction: 'ltr' }}
                        type="tel"
                    />
                    <Button type="submit" variant="primary" block loading={checkOtp.isLoading}>
                        تایید
                    </Button>
                </form>
            </Modal>
            <Visit
                isOpen={visitModal}
                onClose={setVisitModal}
                provider={turn.insuranceType}
                prescriptionId={turn.id}
                refetchData={refetchData}
            />
        </>
    );
};

export { PrescriptionCard };
