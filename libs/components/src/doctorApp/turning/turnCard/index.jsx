import { useHistory } from 'react-router-dom';
import Button from '../../../core/button';
import styles from './turnCard.module.scss';
import moment from 'jalali-moment';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ChevronIcon, PrintIcon, RemoveIcon } from '../../../icons';
import Modal from '../../../core/modal';
import TextField from '../../../core/textField';
import {
    useAddPrescription,
    useCheckOtp,
    useDeletePrescription,
    useGetOnePrescription
} from '@paziresh24/hooks/prescription';
import { digitsFaToEn, addCommaPrice } from '@paziresh24/utils';
import { toast } from 'react-toastify';
import { Loading } from '../../../core/loading';
import Chips from '../../../core/chips';
import { createRef, useEffect } from 'react';
import classNames from 'classnames';
import { useDrApp } from '@paziresh24/context/drapp/index';
import ReactTooltip from 'react-tooltip';
import Visit from '../visit';
import { Mobile, Default } from '@paziresh24/hooks/core/device';
import { sendEvent } from '@paziresh24/utils';
import { getSplunkInstance } from '@paziresh24/components/core/provider';
import { isLessThanExpertDegreeDoctor } from 'apps/drapp/src/functions/isLessThanExpertDegreeDoctor';

const TurnCard = ({ dropDownShowKey, turn, refetchData, dropDownShow, setDropDownShow }) => {
    const [info] = useDrApp();
    const [visitModal, setVisitModal] = useState(false);
    const history = useHistory();
    const [nationalCodeModal, setNationalCodeModal] = useState(false);
    const addPrescription = useAddPrescription();
    const linkClick = createRef();
    const [pdfLink, setPdfLink] = useState();
    const [deletePrescriptionModal, setDeletePrescriptionModal] = useState(false);
    const deletePrescription = useDeletePrescription();
    const checkOtp = useCheckOtp();
    const [otpConfirm, setOtpConfirm] = useState(false);
    const [actionType, setActionType] = useState();
    const getOnePrescription = useGetOnePrescription({ id: turn.prescription?.id });
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const isExpertDoctor = !isLessThanExpertDegreeDoctor(info.doctor?.expertises);

    const {
        register: otpRegister,
        handleSubmit: otpHandleSubmit,
        formState: { errors: otpError }
    } = useForm();

    useEffect(() => {
        if (getOnePrescription.isSuccess) {
            getPdf();
        }
    }, [getOnePrescription.status]);

    const prescription = async data => {
        sendEvent('tajviz', 'prescription', 'tajviz');

        setActionType('prescription');
        if (!turn.national_code && !data?.national_code) {
            return setNationalCodeModal(true);
        }

        if (turn.prescription) {
            window._prescription = { ...turn.prescription };
            history.push(`/prescription/patient/${turn.prescription.id}`);
        } else {
            try {
                const prescriptionData = await createPrescription({
                    national_code: turn.national_code ? turn.national_code : data.national_code,
                    cell: turn.cell,
                    id: turn.id
                });

                getSplunkInstance().sendEvent({
                    group: 'turning-list',
                    type: 'prescription-action'
                });

                if (prescriptionData?.message === 'کد تایید دو مرحله‌ای را ارسال کنید') {
                    return setOtpConfirm(true);
                }

                window._prescription = { ...prescriptionData.result };
                history.push(`/prescription/patient/${prescriptionData.result.id}`);
            } catch (e) {
                getSplunkInstance().sendEvent({
                    group: 'turning-list',
                    type: 'prescription-action-error',
                    event: { error: e.response.data }
                });

                if (e.response.data.message === 'کد تایید دو مرحله‌ای را ارسال کنید') {
                    return setOtpConfirm(true);
                }
                toast.error(e.response.data.message);
                if (
                    e.response.data.message ===
                    'بیمار دارای بیمه تامین اجتماعی می‌باشد. برای تجویز، از قسمت بیمه‌های من احراز هویت کنید.'
                ) {
                    history.push('/providers');
                }
                if (
                    e.response.data.message ===
                    'بیمار دارای بیمه سلامت می‌باشد. برای تجویز، از قسمت بیمه‌های من احراز هویت کنید.'
                ) {
                    history.push('/providers');
                }
            }
        }
    };

    const createPrescription = ({ national_code, cell, id }) => {
        const tags = [];
        tags.push({
            type: 'center_id',
            value: info.center.id
        });
        info.center?.referral_id &&
            tags.push({
                type: 'siam',
                value: info.center.referral_id
            });
        return addPrescription.mutateAsync({
            baseURL: info.center.local_base_url,
            patientCell: digitsFaToEn(cell),
            patientNationalCode: digitsFaToEn(national_code),
            identifier: id,
            tags: tags
        });
    };

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const getPdf = () => {
        if (!turn.prescription?.pdf && !getOnePrescription?.data?.pdf) {
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
            }/pdfs/` + (prescription?.data?.pdf ?? turn.prescription.pdf)
        );
    };

    const deletePrescriptionAction = async () => {
        sendEvent('deletepriscription', 'prescription', 'deletepriscription');

        deletePrescription.mutate(
            { baseURL: info.center.local_base_url, id: turn.prescription?.id },
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

    const visitSubmit = async data => {
        sendEvent('onlyvisit', 'prescription', 'onlyvisit');
        setActionType('visit');
        if (!turn.national_code && !data?.national_code) {
            return setNationalCodeModal(true);
        }
        setNationalCodeModal(false);

        if (turn.prescription) {
            setVisitModal(true);
        } else {
            try {
                if (!isExpertDoctor) return setVisitModal(true);

                const prescriptionData = await createPrescription({
                    national_code: turn.national_code ?? data.national_code,
                    cell: turn.cell,
                    id: turn.id
                });
                if (prescriptionData?.message === 'کد تایید دو مرحله‌ای را ارسال کنید') {
                    return setOtpConfirm(true);
                }
                setVisitModal(true);
            } catch (e) {
                if (e.response.data.message === 'کد تایید دو مرحله‌ای را ارسال کنید') {
                    return setOtpConfirm(true);
                }
                toast.error(e.response.data.message);
                if (
                    e.response.data.message ===
                    'بیمار دارای بیمه تامین اجتماعی می‌باشد. برای تجویز، از قسمت بیمه‌های من احراز هویت کنید.'
                ) {
                    history.push('/providers');
                }
                if (
                    e.response.data.message ===
                    'بیمار دارای بیمه سلامت می‌باشد. برای تجویز، از قسمت بیمه‌های من احراز هویت کنید.'
                ) {
                    history.push('/providers');
                }
            }
        }
    };

    const visitProvider = () => {
        const instructionProvider =
            turn.prescription?.insuranceType ?? addPrescription?.data?.result?.insuranceType;

        if (!isExpertDoctor) return 'paziresh24';
        return instructionProvider;
    };

    return (
        <>
            <Loading show={addPrescription.isLoading} simple />
            <Default>
                <tr
                    className={turn.prescription?.finalized ? styles.disabled : ''}
                    id={`identifier-${turn.id}`}
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
                            <div
                                onClick={() => setIsDetailsOpen(prev => !prev)}
                                aria-hidden
                                style={{ cursor: 'pointer' }}
                            >
                                <ChevronIcon dir={isDetailsOpen ? 'top' : 'bottom'} />
                            </div>
                            {turn.prescription?.insuranceType === 'salamat' &&
                                turn.prescription?.salamat_prescription?.isReference && (
                                    <Chips theme="gray">ارجاع</Chips>
                                )}
                            <span
                                className={styles.name}
                                onClick={isExpertDoctor && prescription}
                                aria-hidden
                                style={{ cursor: isExpertDoctor && 'pointer' }}
                            >
                                {turn.display_name !== '' ? turn.display_name : '-'}
                            </span>
                        </div>
                    </td>
                    <td data-label="شماره موبایل:">
                        <span>{turn.cell ?? '-'}</span>
                    </td>
                    <td data-label="وضعیت نسخه:">
                        {turn.prescription &&
                            (turn.prescription?.finalized ? (
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
                                    {!turn.prescription && '-'}
                                </>
                            ) : turn.prescription?.status === null ? (
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
                                        نسخه ای که هنوز ثبت نشده
                                    </ReactTooltip>
                                </>
                            ) : turn.prescription?.status === 'FAILED' ? (
                                <span className={styles.notFinalized}>خطا در ثبت</span>
                            ) : (
                                <>
                                    <span
                                        className={styles.finalizing}
                                        data-tip
                                        data-for="finalizing"
                                    >
                                        در صف ثبت
                                    </span>
                                    <ReactTooltip
                                        id="finalizing"
                                        place="top"
                                        type="dark"
                                        effect="solid"
                                    >
                                        نسخه ای که به هر علتی با موفقیت صادر نشده اما در بکگراند
                                        برای ارسال آن درحال اقدام هستیم
                                    </ReactTooltip>
                                </>
                            ))}
                        {!turn.prescription && '-'}
                    </td>
                    <td data-label="بیمه بیمار:">
                        {turn.prescription?.insuranceType === 'tamin' && <span>تامین اجتماعی</span>}
                        {turn.prescription?.insuranceType === 'salamat' && <span>سلامت</span>}
                        {!turn.prescription && '-'}
                    </td>
                    <td data-label="زمان نوبت:">
                        <span className={styles['value']}>
                            {moment(turn.from * 1000)
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
                            {moment(turn.from * 1000)
                                .locale('fa')
                                .format('HH:mm')}
                        </span>
                    </td>
                    <td className={styles.actionCol}>
                        <div className={styles.buttonAction}>
                            <Button
                                variant="secondary"
                                size="small"
                                disabled={
                                    turn.prescription?.finalized ||
                                    (!isExpertDoctor && turn.book_status === 'visited')
                                }
                                onClick={() => visitSubmit()}
                                style={{ marginLeft: '1rem' }}
                                loading={addPrescription.isLoading}
                            >
                                {turn.prescription?.finalized ||
                                (!isExpertDoctor && turn.book_status === 'visited')
                                    ? 'ویزیت شده'
                                    : 'ویزیت '}
                            </Button>
                            {isExpertDoctor && (
                                <Button
                                    className={styles.buttonAction}
                                    size="small"
                                    icon={<ChevronIcon color="#27bda0" />}
                                    variant="secondary"
                                    onClick={prescription}
                                >
                                    {turn.prescription?.finalized ? 'مشاهده نسخه' : 'تجویز '}
                                </Button>
                            )}
                            <div className={styles.action}>
                                {pdfLink && (
                                    <a
                                        download={
                                            turn.prescription?.patientAdditionalData?.name +
                                            ' ' +
                                            turn.prescription?.patientAdditionalData?.lastName
                                        }
                                        href={pdfLink}
                                        ref={linkClick}
                                    >
                                        {' '}
                                    </a>
                                )}
                                {isExpertDoctor && (
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
                                            <circle
                                                cx="1.35281"
                                                cy="1.75977"
                                                r="1"
                                                fill="#3F3F79"
                                            />
                                            <circle
                                                cx="1.35281"
                                                cy="6.75977"
                                                r="1"
                                                fill="#3F3F79"
                                            />
                                            <circle
                                                cx="1.35281"
                                                cy="11.7598"
                                                r="1"
                                                fill="#3F3F79"
                                            />
                                        </svg>
                                    </div>
                                )}

                                <ul
                                    className={classNames({
                                        [styles['drop-down']]: true,
                                        [styles['show']]: dropDownShow === dropDownShowKey
                                    })}
                                >
                                    {turn.prescription?.finalized && (
                                        <li
                                            onClick={() =>
                                                turn.prescription
                                                    ? getPdf()
                                                    : setDropDownShow(false)
                                            }
                                            aria-hidden
                                            className={!turn.prescription ? styles.disabled : ''}
                                        >
                                            <PrintIcon />
                                            <span>pdf نسخه</span>
                                        </li>
                                    )}
                                    {!turn.prescription?.finalized && (
                                        <li
                                            onClick={() =>
                                                turn.prescription
                                                    ? setDeletePrescriptionModal(true)
                                                    : setDropDownShow(false)
                                            }
                                            className={!turn.prescription ? styles.disabled : ''}
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
                                    gap: '5rem',
                                    width: '100%',
                                    padding: '1.5rem 2rem',
                                    borderRadius: '0rem'
                                }}
                            >
                                <div className="flex space-s-3">
                                    <span>کدملی</span>
                                    <span>
                                        {turn.prescription?.patientNationalCode ??
                                            turn.national_code ??
                                            '-'}
                                    </span>
                                </div>

                                {info.center.id === '5532' && (
                                    <>
                                        <div className="flex space-s-3">
                                            <span>وضعیت پرداخت: </span>
                                            <span>
                                                {turn.payment_status === 'paid' && (
                                                    <span>پرداخت شده</span>
                                                )}
                                                {turn.payment_status === 'refunded' && (
                                                    <span>استرداد شده</span>
                                                )}
                                                {!turn.payment_status && <span> - </span>}
                                            </span>
                                        </div>
                                        <div className="flex space-s-3">
                                            <span>مبلغ ویزیت: </span>
                                            <span>
                                                {turn.user_payment
                                                    ? `${addCommaPrice(turn.user_payment)} تومان`
                                                    : '-'}
                                            </span>
                                        </div>
                                    </>
                                )}

                                {isExpertDoctor && (
                                    <>
                                        <div className="flex space-s-3">
                                            <span>کد پیگیری</span>
                                            <span>
                                                {turn.prescription?.insuranceType === 'tamin' &&
                                                    turn.prescription?.tamin_prescription.map(
                                                        item => (
                                                            <span
                                                                style={{
                                                                    fontSize: '1.4rem',
                                                                    marginRight: '1rem'
                                                                }}
                                                                key={item.head_EPRSC_ID}
                                                            >
                                                                {item.head_EPRSC_ID ?? '-'}
                                                            </span>
                                                        )
                                                    )}
                                                {turn.prescription?.insuranceType === 'salamat' && (
                                                    <span
                                                        style={{
                                                            fontSize: '1.4rem',
                                                            marginRight: '1rem'
                                                        }}
                                                    >
                                                        {turn.prescription?.salamat_prescription
                                                            ?.trackingCode ?? ''}
                                                    </span>
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex space-s-3">
                                            <span>کد توالی</span>
                                            <span>
                                                {turn.prescription?.salamat_prescription
                                                    ?.sequenceNumber ?? '-'}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </td>
                    </tr>
                )}
            </Default>
            <Mobile>
                <div className={styles.card}>
                    <span className="font-medium">
                        <span>{turn.display_name !== '' ? turn.display_name : '-'}</span>
                    </span>
                    {turn.prescription && (
                        <div className={styles.dropDown}>
                            {pdfLink && (
                                <a
                                    download={
                                        turn.prescription?.patientAdditionalData?.name +
                                        ' ' +
                                        turn.prescription?.patientAdditionalData?.lastName
                                    }
                                    href={pdfLink}
                                    ref={linkClick}
                                >
                                    {' '}
                                </a>
                            )}
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
                                {turn.prescription?.finalized && (
                                    <li
                                        onClick={() =>
                                            turn.prescription ? getPdf() : setDropDownShow(false)
                                        }
                                        aria-hidden
                                        className={!turn.prescription ? styles.disabled : ''}
                                    >
                                        <PrintIcon />
                                        <span>pdf نسخه</span>
                                    </li>
                                )}
                                {!turn.prescription?.finalized && (
                                    <li
                                        onClick={() =>
                                            turn.prescription
                                                ? setDeletePrescriptionModal(true)
                                                : setDropDownShow(false)
                                        }
                                        className={!turn.prescription ? styles.disabled : ''}
                                        aria-hidden
                                    >
                                        <RemoveIcon />
                                        <span>حذف نسخه</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                    <div className={styles.patientInfo}>
                        <div className={styles.patientInfoRow}>
                            <div className="w-full">
                                <span>شماره موبایل: </span>
                                <span>{turn.cell ?? '-'}</span>
                            </div>
                            <div className="w-full">
                                <span>زمان نوبت: </span>
                                <span>
                                    {moment(turn.from * 1000)
                                        .locale('fa')
                                        .calendar(null, {
                                            sameDay: '[امروز]',
                                            nextDay: '[فردا]',
                                            nextWeek: 'D MMMM',
                                            lastDay: '[دیروز]',
                                            lastWeek: 'D MMMM',
                                            sameElse: 'D MMMM'
                                        })}{' '}
                                    {moment(turn.from * 1000)
                                        .locale('fa')
                                        .format('HH:mm')}
                                </span>
                            </div>
                        </div>
                        <div className={styles.patientInfoRow}>
                            <div className="w-full">
                                <span>کدپیگیری نسخه: </span>
                                <span>
                                    {turn.prescription?.insuranceType === 'tamin' &&
                                        turn.prescription?.tamin_prescription.map(item => (
                                            <span key={item.head_EPRSC_ID}>
                                                {item.head_EPRSC_ID ?? '-'}
                                            </span>
                                        ))}
                                    {turn.prescription?.insuranceType === 'salamat' && (
                                        <span>
                                            {turn.prescription?.salamat_prescription
                                                ?.trackingCode ?? ''}
                                        </span>
                                    )}
                                </span>
                            </div>
                            <div className="w-full">
                                <span>وضعیت نسخه: </span>
                                <span>
                                    {!turn.prescription && '-'}
                                    {turn.prescription &&
                                        (turn.prescription?.finalized ? (
                                            <span data-tip data-for="finalizedhint">
                                                ثبت شده
                                            </span>
                                        ) : turn.prescription?.status === null ? (
                                            <span data-tip data-for="notFinalized">
                                                ثبت نشده
                                            </span>
                                        ) : turn.prescription?.status === 'FAILED' ? (
                                            <span className={styles.notFinalized}>خطا در ثبت</span>
                                        ) : (
                                            <span data-tip data-for="finalizing">
                                                در صف ثبت
                                            </span>
                                        ))}
                                </span>
                            </div>
                        </div>
                        {info.center.id === '5532' && (
                            <div className={styles.patientInfoRow}>
                                <div className="w-full">
                                    <span>وضعیت پرداخت: </span>
                                    <span>
                                        {turn.payment_status === 'paid' && <span>پرداخت شده</span>}
                                        {turn.payment_status === 'refund' && <span>استرداد</span>}
                                        {!turn.payment_status && <span> - </span>}
                                    </span>
                                </div>
                                <div className="w-full">
                                    <span>مبلغ ویزیت: </span>
                                    <span>
                                        {turn.user_payment
                                            ? `${addCommaPrice(turn.user_payment)} تومان`
                                            : '-'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={styles.cardAction}>
                        <Button
                            variant="secondary"
                            size="small"
                            disabled={
                                turn.prescription?.finalized ||
                                (!isExpertDoctor && turn.book_status === 'visited')
                            }
                            block
                            onClick={() => visitSubmit()}
                            loading={addPrescription.isLoading}
                        >
                            {turn.prescription?.finalized ||
                            (!isExpertDoctor && turn.book_status === 'visited')
                                ? 'ویزیت شده'
                                : 'ویزیت '}
                        </Button>
                        {isExpertDoctor && (
                            <Button variant="secondary" size="small" block onClick={prescription}>
                                {turn.prescription?.finalized ? 'مشاهده نسخه' : 'تجویز '}
                            </Button>
                        )}
                    </div>
                </div>
            </Mobile>
            <Modal
                title="لطفا کدملی بیمار را وارد نمایید."
                isOpen={nationalCodeModal}
                onClose={setNationalCodeModal}
            >
                <form
                    className={styles['col']}
                    onSubmit={handleSubmit(actionType === 'visit' ? visitSubmit : prescription)}
                >
                    <TextField
                        type="text"
                        label="کدملی"
                        error={errors.fullName}
                        {...register('national_code', { required: true })}
                    />
                    <Button type="submit">تایید</Button>
                </form>
            </Modal>
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
                provider={visitProvider()}
                bookId={turn.id}
                prescriptionId={turn.prescription?.id ?? addPrescription?.data?.result?.id}
                refetchData={refetchData}
            />
        </>
    );
};

export { TurnCard };
