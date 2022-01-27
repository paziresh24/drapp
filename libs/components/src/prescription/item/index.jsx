import styles from './item.module.scss';
import classNames from 'classnames';
import { useGetPrescriptionPDF } from '@paziresh24/hooks/prescription';

import { RemoveIcon, PrintIcon } from '../../icons';

import moment from 'jalali-moment';
import queryString from 'querystring';

// hooks
import { createRef, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Button from '../../core/button/index';
import { ChevronIcon } from '../../icons';
import Modal from '../../core/modal/index';
import { useDeletePrescription } from '@paziresh24/hooks/prescription';
import { sendEvent } from '@paziresh24/utils';
import Visit from '../turnsList/visit/index';
import { Default, Mobile } from '@paziresh24/hooks/device';

const Item = ({ dropDownShowKey, turn, refetchData, dropDownShow, setDropDownShow }) => {
    const getPrescriptionPDF = useGetPrescriptionPDF({ id: turn.id });
    const [pdfLink, setPdfLink] = useState();
    const linkClick = createRef();
    const [visitModal, setVisitModal] = useState(false);
    const [deletePrescriptionModal, setDeletePrescriptionModal] = useState(false);
    const deletePrescription = useDeletePrescription();
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        getPrescriptionPDF.remove();
    }, []);

    useEffect(() => {
        if (getPrescriptionPDF.isSuccess) {
            setPdfLink(`data:application/pdf;base64,${getPrescriptionPDF.data.data}`);
        }
        if (getPrescriptionPDF.isError) {
            console.clear();
            !toast.isActive('getPdf') &&
                toast.error(getPrescriptionPDF.error.response.data.message, {
                    toastId: 'getPdf'
                });
            getPrescriptionPDF.remove();
        }
    }, [getPrescriptionPDF.status]);

    useEffect(() => {
        if (pdfLink) {
            linkClick.current.click();
            setPdfLink(false);
        }
    }, [pdfLink]);

    const prescription = force => {
        window.open(
            `${
                process.env.NODE_ENV === 'production'
                    ? window.location.hostname === window._env_.P24_MAIN_DOMAIN
                        ? window._env_.P24_BASE_URL_PRESCRIPTION_API
                        : (queryString.parse(window.location.search)?.baseURL ??
                              window.location.origin) + '/prescription-api'
                    : window._env_.P24_BASE_URL_PRESCRIPTION_API
            }/pdfs/` + turn.pdf
        );
    };

    const deletePrescriptionAction = async () => {
        sendEvent('deletepriscription', 'prescription', 'deletepriscription');

        deletePrescription.mutate(turn.id, {
            onSuccess: data => {
                refetchData();
                setDeletePrescriptionModal(false);
            },
            onError: error => {
                setDeletePrescriptionModal(false);

                !toast.isActive('deletePrescription') &&
                    toast.error(error.response.data.message, {
                        toastId: 'deletePrescription'
                    });
            }
        });
    };

    return (
        <>
            <Default>
                <tr className={turn.finalized ? styles.disabled : ''}>
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

                            <span className={styles.name}>
                                {turn.patientAdditionalData.name +
                                    ' ' +
                                    turn.patientAdditionalData.lastName}
                            </span>
                        </div>
                    </td>
                    <td data-label="کدملی:">
                        <span>{turn.patientNationalCode ?? '-'}</span>
                    </td>
                    <td data-label="وضعیت نسخه:">
                        {turn?.insuranceType === 'tamin' &&
                            turn[turn?.insuranceType + '_prescription'].map(item => (
                                <span key={item.head_EPRSC_ID}>{item.head_EPRSC_ID ?? '-'}</span>
                            ))}
                        {turn?.insuranceType === 'salamat' && (
                            <span
                                key={
                                    turn[turn?.prescription?.insuranceType + '_prescription']
                                        ?.trackingCode
                                }
                            >
                                {turn[turn?.insuranceType + '_prescription']?.trackingCode ?? ''}
                            </span>
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
                            {turn.pdf && (
                                <Button
                                    size="small"
                                    icon={<ChevronIcon color="#27bda0" />}
                                    variant="secondary"
                                    onClick={prescription}
                                >
                                    {turn.finalized ? 'مشاهده نسخه' : 'تجویز '}
                                </Button>
                            )}

                            <div className={styles.action}>
                                {pdfLink && (
                                    <a
                                        download={
                                            turn.patientAdditionalData.name +
                                            ' ' +
                                            turn.patientAdditionalData.lastName
                                        }
                                        href={pdfLink}
                                        ref={linkClick}
                                    >
                                        {' '}
                                    </a>
                                )}
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
                                    // justifyContent: 'space-between',
                                    gap: '5rem',
                                    width: '100%',
                                    // background: '#fff',
                                    padding: '1.5rem 2rem',
                                    borderRadius: '0rem'
                                }}
                            >
                                <div className={styles['row']}>
                                    <div className={styles['col']}>
                                        <span className={styles['title']}>شماره موبایل</span>
                                        <span className={styles['value']}>
                                            {turn.patientCell ?? '-'}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles['row']}>
                                    <div className={styles['col']} data-tip data-for="geoInfo">
                                        <span className={styles['title']}>کد پیگیری</span>
                                        <span className={styles['value']}>
                                            {turn?.insuranceType === 'tamin' &&
                                                turn[turn?.insuranceType + '_prescription'].map(
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
                                            {turn?.insuranceType === 'salamat' && (
                                                <span
                                                    style={{
                                                        fontSize: '1.4rem',
                                                        marginRight: '1rem'
                                                    }}
                                                    key={
                                                        turn[
                                                            turn?.prescription?.insuranceType +
                                                                '_prescription'
                                                        ]?.trackingCode
                                                    }
                                                >
                                                    {turn[turn?.insuranceType + '_prescription']
                                                        ?.trackingCode ?? ''}
                                                </span>
                                            )}{' '}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles['row']}>
                                    <div className={styles['col']}>
                                        <span className={styles['title']}>کد توالی</span>
                                        <span className={styles['value']}>
                                            {turn.salamat_prescription?.sequenceNumber ?? '-'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                )}
            </Default>
            <Mobile>
                <div className={styles['turn-card']}>
                    <span className="font-medium" style={{ fontWeight: '500' }}>
                        {turn.patientAdditionalData.name +
                            ' ' +
                            turn.patientAdditionalData.lastName}
                    </span>

                    <div
                        className="flex flex-col space-y-4 opacity-75 text-2xl"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            opacity: '0.75',
                            fontSize: '1.5rem',
                            padding: '0.5rem 0'
                        }}
                    >
                        <div className="flex gap-7" style={{ display: 'flex' }}>
                            <div className="w-full" style={{ width: '100%' }}>
                                <span>شماره موبایل: </span>
                                <span>{turn.patientCell ?? '-'}</span>
                            </div>
                            <div className="w-full" style={{ width: '100%' }}>
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
                        <div className="flex gap-7" style={{ display: 'flex' }}>
                            <div className="w-full" style={{ width: '100%' }}>
                                <span>کدپیگیری نسخه: </span>
                                <span>
                                    {turn?.insuranceType === 'tamin' &&
                                        turn[turn?.insuranceType + '_prescription'].map(item => (
                                            <span key={item.head_EPRSC_ID}>
                                                {item.head_EPRSC_ID ?? '-'}
                                            </span>
                                        ))}
                                    {turn?.insuranceType === 'salamat' && (
                                        <span
                                            key={
                                                turn[
                                                    turn?.prescription?.insuranceType +
                                                        '_prescription'
                                                ]?.trackingCode
                                            }
                                        >
                                            {turn[turn?.insuranceType + '_prescription']
                                                ?.trackingCode ?? ''}
                                        </span>
                                    )}
                                </span>
                            </div>
                            <div className="w-full" style={{ width: '100%' }}>
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
                    <div className="flex items-center gap-3">
                        {turn.pdf && (
                            <Button variant="secondary" size="small" block onClick={prescription}>
                                {turn.finalized ? 'مشاهده نسخه' : 'تجویز '}
                            </Button>
                        )}
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

export { Item };
