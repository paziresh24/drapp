/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import styles from '@assets/styles/pages/drApp/turning.module.scss';
import { StatusBar } from '@paziresh24/components/doctorApp/turning/statusBar';
import { SelectDate } from '@paziresh24/components/doctorApp/turning/selectDate';
import { useGetTurns } from '@paziresh24/hooks/drapp/turning';
import { useDrApp } from '@paziresh24/context/drapp';
import { EmptyState } from '@paziresh24/components/core/emptyState';
import { toast } from 'react-toastify';
import Button from '@paziresh24/components/core/button';
import TextField from '@paziresh24/components/core/textField';
import Modal from '@paziresh24/components/core/modal';
import { CalendarPlus, CircleTick } from '@paziresh24/components/icons';
import { useEffect, useState, useRef } from 'react';
import { useAddNewBook } from '@paziresh24/hooks/drapp/turning';
import {
    useAddPrescription,
    useCheckOtp,
    useGetPrescriptions
} from '@paziresh24/hooks/prescription';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import moment from 'jalali-moment';
import { TurnTime } from '@paziresh24/components/doctorApp/turning/turnTime';
import { toEnglishNumber } from '@paziresh24/utils';
import { v4 as uuid } from 'uuid';
import { useUpdatePrescription } from '@paziresh24/hooks/prescription/types';
import Error from '@paziresh24/components/core/error';
import { getCookie, setCookie } from '@paziresh24/utils/cookie';
import { SettingIcon } from '@paziresh24/components/icons';
import Visit from '@paziresh24/components/doctorApp/turning/visit';
import { Default, Mobile } from '@paziresh24/hooks/core/device';
import { useMediaQuery } from 'react-responsive';
import TurnsList from '@paziresh24/components/doctorApp/turning/tutnsList/default';
import { useTour } from '@reactour/tour';
import queryString from 'query-string';
import updatingImage from '@paziresh24/assets/images/drapp/updating.jpg';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import { queryClient } from '@paziresh24/components/core/provider';

const Turning = () => {
    const history = useHistory();
    const location = useLocation();
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [info] = useDrApp();
    const [openNewTurn, setOpenNewTurn] = useState(false);
    const addNewBook = useAddNewBook();
    const addPrescription = useAddPrescription();
    const [turnDetailsModal, setTurnDetailsModal] = useState();
    const [turnDetailsData, setTurnDetailsData] = useState({});
    const [date, setDate] = useState(
        getCookie('turning_date') ? JSON.parse(getCookie('turning_date')) : null
    );
    const [moveDeleteModal, setMoveDeleteModal] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [page, setPage] = useState(1);
    const getTurn = useGetTurns({
        baseURL: info.center.local_base_url,
        ...(info.center.local_base_url && { is_direct: 1 }),
        center_id: info.center.id,
        date:
            moment
                .from(`${date?.year}/${date?.month}/${date?.day}`, 'fa', 'JYYYY/JMM/JDD')
                .format('x') / 1000,
        search: searchValue,
        page: page,
        user_id: info.center.user_info_id
    });
    const [turnTimeModal, setTurnTimeModal] = useState(false);
    const uuidInstance = uuid();
    const [results, setResults] = useState([]);
    const getPrescription = useGetPrescriptions({
        baseURL: info.center.local_base_url,
        _q: searchValue,
        created_at_lte: moment
            .from(`${date?.year}/${date?.month}/${date?.day}`, 'fa', 'JYYYY/JMM/JDD')
            .add({ days: 1 })

            .local('en')
            .format('YYYY-MM-DD'),
        created_at_gte: moment
            .from(`${date?.year}/${date?.month}/${date?.day}`, 'fa', 'JYYYY/JMM/JDD')
            .local('en')
            .format('YYYY-MM-DD')
    });
    const [confirmCellPhone, setConfirmCellPhone] = useState(null);
    const checkOtp = useCheckOtp();
    const [otpConfirm, setOtpConfirm] = useState(false);
    const { setIsOpen: tourState, setCurrentStep: setSteps } = useTour();
    const [prescriptionSuccessedModal, setPrescriptionSuccessedModal] = useState(false);
    const [error, setIsError] = useState(false);
    const nationalCodeRef = useRef();
    const [prescriptionPendingModal, setPrescriptionPendingModal] = useState(false);

    useEffect(() => {
        if (location.state?.prescriptionInfo && getTurn.data?.data) {
            const resultsUpdate = getTurn.data.data.map(item =>
                item.type === 'prescription'
                    ? item.id === location.state?.prescriptionInfo?.id
                        ? { ...item, ...location.state?.prescriptionInfo }
                        : { ...item }
                    : item?.prescription?.id === location.state?.prescriptionInfo?.id
                    ? {
                          ...item,
                          prescription: {
                              ...item.prescription,
                              ...location.state?.prescriptionInfo
                          }
                      }
                    : { ...item }
            );
            queryClient.setQueryData(
                [
                    'turns',
                    {
                        baseURL: info.center?.local_base_url,
                        ...(info.center?.local_base_url && { is_direct: 1 }),
                        center_id: info.center?.id,
                        date:
                            moment
                                .from(
                                    `${date?.year}/${date?.month}/${date?.day}`,
                                    'fa',
                                    'JYYYY/JMM/JDD'
                                )
                                .format('x') / 1000,
                        search: searchValue,
                        page: page,
                        user_id: info.center?.user_info_id
                    }
                ],
                { data: resultsUpdate }
            );
            history.replace();
        }

        if (location.state?.prescriptionInfo && location.state?.prescriptionInfo.finalized) {
            setPrescriptionSuccessedModal(location.state?.prescriptionInfo);
            history.replace();
        }
        if (
            location.state?.prescriptionInfo &&
            !location.state?.prescriptionInfo.finalized &&
            location.state?.prescriptionInfo.status === 'SUBMITTED'
        ) {
            setPrescriptionPendingModal(location.state?.prescriptionInfo);
            history.replace();
        }
    }, [location.state]);

    const {
        register: otpRegister,
        handleSubmit: otpHandleSubmit,
        formState: { errors: otpError }
    } = useForm();

    useEffect(() => {
        if (page > 1) {
            getTurn.refetch();
        }
    }, [page]);

    useEffect(() => {
        resetTurnForm();
        setConfirmCellPhone(null);
        if (openNewTurn) nationalCodeRef.current.focus();
    }, [openNewTurn]);

    useEffect(() => {
        if (date) {
            var currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 1);
            setCookie(
                'turning_date',
                JSON.stringify(date),
                new Date(currentDate.setHours(0, 0, 0, 0)).toUTCString()
            );
            refetchData();
        }
    }, [date]);

    useEffect(() => {
        setResults([]);
    }, []);

    useEffect(() => {
        refetchData();
    }, [info.center]);

    useEffect(() => {
        if (getTurn.isSuccess) {
            setResults(prevState => prevState.concat(getTurn.data.data));
        }
        if (getPrescription.isSuccess) {
            setResults(prevState => prevState.concat(getPrescription.data));
        }
    }, [getTurn.status, getPrescription.status]);

    const onChangeSearch = debounce(
        e => {
            setSearchValue(e.target.value);
            getTurn.remove();
            getPrescription.remove();
            setResults([]);
            setPage(1);
            setTimeout(() => {
                getTurn.refetch();
            }, 0);
        },
        500,
        500,
        { leading: true, trailing: false }
    );

    const refetchData = () => {
        const excloudeCenter = ['648', '647', '347', '399', '502', '339', '347', '647'];
        if (!excloudeCenter.includes(info.center.id)) {
            setIsError(false);

            if (date) {
                // setResults([]);
                // getTurn.remove();
                // setTimeout(() => {
                getTurn.refetch();
                // }, 0);
            }
        } else {
            setIsError(true);
        }
    };

    const updatePrescription = useUpdatePrescription();
    const addBookAction = data => {
        const tags = [];
        tags.push({
            type: 'center_id',
            value: info.center.id
        });
        info.center.referral_id &&
            tags.push({
                type: 'siam',
                value: info.center.referral_id
            });
        addPrescription.mutate(
            {
                baseURL: info.center.local_base_url,
                patientNationalCode: toEnglishNumber(data.national_code),
                identifier: uuidInstance,
                tags: tags
            },
            {
                onSuccess: data => {
                    if (data?.message === 'کد تایید دو مرحله‌ای را ارسال کنید') {
                        return setOtpConfirm(true);
                    }
                    if (data.result.insuranceType === 'tamin' && data.result.patientCell === null) {
                        tourState(false);
                        return setConfirmCellPhone(data.result);
                    }
                    getTurn.remove();
                    setResults([]);
                    setPage(1);
                    tourState(false);
                    setTimeout(() => {
                        getTurn.refetch();
                        window._prescription = { ...data.result };
                        if (queryString.parse(window.location.search).learn) {
                            history.push(`/prescription/patient/${data.result.id}?learn=true`);
                        } else {
                            history.push(`/prescription/patient/${data.result.id}`);
                        }
                        setOpenNewTurn(false);
                    });
                },
                onError: error => {
                    if (error.response.data.message === 'کد تایید دو مرحله‌ای را ارسال کنید') {
                        return setOtpConfirm(true);
                    }
                    toast.error(error.response.data.message);
                    if (
                        error.response.data.message ===
                        'بیمار دارای بیمه تامین اجتماعی می‌باشد. برای تجویز، از قسمت بیمه‌های من احراز هویت کنید.'
                    ) {
                        history.push('/prescription/providers');
                    }
                    if (
                        error.response.data.message ===
                        'بیمار دارای بیمه سلامت می‌باشد. برای تجویز، از قسمت بیمه‌های من احراز هویت کنید.'
                    ) {
                        history.push('/prescription/providers');
                    }
                }
            }
        );
    };
    const [visitModal, setVisitModal] = useState();
    const addVisitAction = data => {
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
        addPrescription.mutate(
            {
                baseURL: info.center.local_base_url,
                patientNationalCode: toEnglishNumber(data.national_code),
                identifier: uuidInstance,
                tags: tags
            },
            {
                onSuccess: data => {
                    if (data?.message === 'کد تایید دو مرحله‌ای را ارسال کنید') {
                        return setOtpConfirm(true);
                    }
                    // if (data.result.insuranceType === 'tamin' && data.result.patientCell !== null) {
                    //     tourState(false);
                    //     return setConfirmCellPhone(data.result);
                    // }
                    refetchData();
                    setOpenNewTurn(false);
                    setVisitModal(true);
                },
                onError: error => {
                    if (error.response.data.message === 'کد تایید دو مرحله‌ای را ارسال کنید') {
                        return setOtpConfirm(true);
                    }
                    toast.error(error.response.data.message);
                    if (
                        error.response.data.message ===
                        'بیمار دارای بیمه تامین اجتماعی می‌باشد. برای تجویز، از قسمت بیمه‌های من احراز هویت کنید.'
                    ) {
                        history.push('/prescription/providers');
                    }
                    if (
                        error.response.data.message ===
                        'بیمار دارای بیمه سلامت می‌باشد. برای تجویز، از قسمت بیمه‌های من احراز هویت کنید.'
                    ) {
                        history.push('/prescription/providers');
                    }
                }
            }
        );
    };

    const updateCellPhone = data => {
        return updatePrescription.mutate(
            {
                baseURL: info.center.local_base_url,
                prescriptionId: confirmCellPhone.id,
                patientCell: toEnglishNumber(data.cell)
            },
            {
                onSuccess: () => {
                    getTurn.refetch();
                    window._prescription = { ...confirmCellPhone };
                    if (queryString.parse(window.location.search).learn) {
                        history.push(`/prescription/patient/${confirmCellPhone.id}?learn=true`);
                    } else {
                        history.push(`/prescription/patient/${confirmCellPhone.id}`);
                    }
                    setConfirmCellPhone(null);
                    setOpenNewTurn(false);
                },
                onError: error => {
                    toast.error(error.response.data.message);
                }
            }
        );
    };

    const {
        register: addBookRegisterFrom,
        handleSubmit: addBookSubmit,
        formState: { errors: addBookErrors },
        reset: resetTurnForm
    } = useForm();

    const items = [];

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
        // if (!openNewTurn) tourState(false);
    }, [openNewTurn]);

    const { ref, ...rest } = addBookRegisterFrom('national_code', {
        required: true,
        maxLength: 12,
        minLength: 10
    });

    return (
        <>
            <Visit
                isOpen={visitModal}
                onClose={setVisitModal}
                provider={addPrescription?.data?.result?.insuranceType}
                prescriptionId={addPrescription?.data?.result?.id}
                refetchData={refetchData}
            />
            <div className={styles['wrapper']}>
                {!error && (
                    <div className={styles['head-bar']}>
                        <div className={styles.filterWrapper}>
                            <div className={styles['search-wrapper']}>
                                <svg
                                    width="19"
                                    height="19"
                                    viewBox="0 0 19 19"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M18.0867 16.785L14.6858 13.4117C16.0059 11.7657 16.6452 9.67652 16.4722 7.57368C16.2993 5.47085 15.3272 3.51421 13.7559 2.10608C12.1846 0.697956 10.1335 -0.0546237 8.02434 0.00309005C5.91519 0.0608038 3.90832 0.924424 2.41637 2.41637C0.924424 3.90832 0.0608038 5.91519 0.00309005 8.02434C-0.0546237 10.1335 0.697956 12.1846 2.10608 13.7559C3.51421 15.3272 5.47085 16.2993 7.57368 16.4722C9.67651 16.6452 11.7657 16.0059 13.4117 14.6858L16.785 18.0592C16.8702 18.1451 16.9716 18.2133 17.0833 18.2598C17.195 18.3063 17.3148 18.3303 17.4358 18.3303C17.5568 18.3303 17.6766 18.3063 17.7884 18.2598C17.9001 18.2133 18.0014 18.1451 18.0867 18.0592C18.2519 17.8882 18.3442 17.6598 18.3442 17.4221C18.3442 17.1844 18.2519 16.9559 18.0867 16.785ZM8.26916 14.6858C7.00006 14.6858 5.75946 14.3095 4.70425 13.6044C3.64903 12.8994 2.82659 11.8972 2.34093 10.7247C1.85527 9.55222 1.7282 8.26204 1.97579 7.01733C2.22337 5.77262 2.8345 4.62928 3.73189 3.73189C4.62928 2.8345 5.77262 2.22338 7.01733 1.97579C8.26204 1.7282 9.55222 1.85527 10.7247 2.34093C11.8972 2.82659 12.8994 3.64903 13.6044 4.70425C14.3095 5.75947 14.6858 7.00006 14.6858 8.26916C14.6858 9.97097 14.0098 11.6031 12.8064 12.8064C11.6031 14.0098 9.97096 14.6858 8.26916 14.6858Z"
                                        fill="#3F3F79"
                                        opacity="0.5"
                                    />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="نام بیمار، شماره موبایل یا کد ملی ..."
                                    onChange={onChangeSearch}
                                />
                            </div>
                            <hr />

                            <div className={styles.selectDate}>
                                <SelectDate
                                    today
                                    value={setDate}
                                    nagivateDate={isMobile}
                                    defaultValue={
                                        getCookie('turning_date') ? getCookie('turning_date') : null
                                    }
                                />
                                {isMobile &&
                                    info.center.is_active_booking &&
                                    info.center.type_id === 1 && (
                                        <Button
                                            style={{ maxWidth: '4.3rem', padding: '1.1rem' }}
                                            variant="secondary"
                                            size="medium"
                                            icon={<SettingIcon />}
                                            onClick={() => setMoveDeleteModal(true)}
                                        />
                                    )}
                            </div>
                        </div>
                        <StatusBar
                            isOpen={moveDeleteModal}
                            setMoveDeleteModal={setMoveDeleteModal}
                            setOpenNewTurn={setOpenNewTurn}
                            refetchData={refetchData}
                        />
                    </div>
                )}
                <div
                    className={styles['turn-cards']}
                    style={{ overflow: getTurn.isLoading && 'hidden' }}
                >
                    {error && (
                        <div className={styles['error-message']}>
                            <img src={updatingImage} alt="" />

                            <span className={styles.errorTitle}>درحال بروز رسانی سامانه هستیم</span>
                            <span>بزودی با تغییرات جدید فعال خواهیم شد.</span>
                        </div>
                    )}

                    {getTurn.isSuccess && isEmpty(getTurn.data.data) && (
                        <EmptyState text="نوبتی وجود ندارد" />
                    )}

                    {getTurn.isError &&
                        getTurn.error.response.data === "Center's server is off ..." && (
                            <EmptyState text="مرکز فعال نمی باشد." />
                        )}

                    {getTurn.isError && getTurn.error.message !== "Center's server is off ..." && (
                        <Error
                            error={getTurn.error.response.data.message}
                            message={`خطا در دریافت نوبت های ${info.center.name}`}
                        />
                    )}

                    <TurnsList
                        turns={getTurn.isSuccess && getTurn.data?.data}
                        loading={getTurn.isLoading}
                        refetchData={refetchData}
                    />

                    <Mobile>
                        <div className={styles['add-turn-button-mask']} />
                        <button
                            className={styles['add-turn-button']}
                            onClick={() => {
                                setOpenNewTurn(true);
                            }}
                        >
                            افزودن بیمار
                        </button>
                    </Mobile>
                </div>
            </div>

            <Modal
                title="افزودن بیمار"
                isOpen={openNewTurn}
                onClose={setOpenNewTurn}
                icon={<CalendarPlus fill="#27bda0" />}
                id="turn-form"
            >
                <div className={`${styles['new-turn']}`}>
                    <TextField
                        type="tel"
                        label="کدملی/کداتباع"
                        pattern="\d*"
                        error={addBookErrors.national_code}
                        disabled={!isEmpty(confirmCellPhone)}
                        {...rest}
                        ref={e => {
                            ref(e);
                            nationalCodeRef.current = e;
                        }}
                    />
                    {!isEmpty(confirmCellPhone) && (
                        <TextField
                            type="tel"
                            label="شماره موبایل"
                            pattern="\d*"
                            error={addBookErrors.cell}
                            {...addBookRegisterFrom('cell', {
                                required: true,
                                minLength: 11,
                                maxLength: 11
                            })}
                        />
                    )}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {!isEmpty(confirmCellPhone) && (
                            <Button
                                block
                                onClick={addBookSubmit(updateCellPhone)}
                                loading={
                                    addNewBook.isLoading ||
                                    getTurn.isLoading ||
                                    addPrescription.isLoading ||
                                    updatePrescription.isLoading
                                }
                            >
                                تایید
                            </Button>
                        )}
                        {isEmpty(confirmCellPhone) && (
                            <>
                                <Button
                                    block
                                    onClick={addBookSubmit(addBookAction)}
                                    loading={
                                        addNewBook.isLoading ||
                                        getTurn.isLoading ||
                                        addPrescription.isLoading ||
                                        updatePrescription.isLoading
                                    }
                                >
                                    تجویز نسخه
                                </Button>
                                <Button
                                    block
                                    variant="secondary"
                                    onClick={addBookSubmit(addVisitAction)}
                                    loading={
                                        addNewBook.isLoading ||
                                        getTurn.isLoading ||
                                        addPrescription.isLoading ||
                                        updatePrescription.isLoading
                                    }
                                >
                                    ثبت ویزیت
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </Modal>

            <Modal
                title="نوبت با موفقیت ثبت شد"
                icon={<CircleTick />}
                isOpen={turnDetailsModal}
                onClose={setTurnDetailsModal}
            >
                <div className={styles['new-turn']} style={{ padding: '1rem 0' }}>
                    <div className={styles['row']}>
                        <div className={styles['col']}>
                            <span className={styles['title']}>نام بیمار</span>
                            <span className={styles['value']}>
                                {turnDetailsData.patient_full_name}
                            </span>
                        </div>
                    </div>
                    <div className={styles['row']}>
                        <div className={styles['col']}>
                            <span className={styles['title']}>شماره تماس</span>
                            <span className={styles['value']}>{turnDetailsData.patient_cell}</span>
                        </div>
                        <div className={styles['col']}>
                            <span className={styles['title']}>کدملی</span>
                            <span className={styles['value']}>
                                {turnDetailsData.patient_national_code}
                            </span>
                        </div>
                    </div>
                    <hr color="#eee" />
                    <div className={styles['row']}>
                        <div className={styles['col']}>
                            <span className={styles['title']}>کد پیگیری</span>
                            <span className={styles['value']}>{turnDetailsData.ref_id}</span>
                        </div>
                        <div className={styles['col']}>
                            <span className={styles['title']}>زمان نوبت</span>
                            <span className={styles['value']}>
                                {new Date(turnDetailsData.from * 1000).toLocaleDateString('fa') +
                                    ' ' +
                                    new Date(turnDetailsData.from * 1000).getHours() +
                                    ':' +
                                    new Date(turnDetailsData.from * 1000).getMinutes()}
                            </span>
                        </div>
                    </div>
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
            <Modal
                title="نسخه با موفقیت ثبت شد"
                isOpen={prescriptionSuccessedModal}
                onClose={setPrescriptionSuccessedModal}
            >
                <span style={{ lineHeight: '2.5rem' }}>
                    نسخه{' '}
                    {prescriptionSuccessedModal?.patientAdditionalData?.name +
                        ' ' +
                        prescriptionSuccessedModal?.patientAdditionalData?.lastName}{' '}
                    با کد پیگیری{' '}
                    {prescriptionSuccessedModal?.insuranceType === 'tamin' &&
                        prescriptionSuccessedModal?.[
                            prescriptionSuccessedModal?.insuranceType + '_prescriptions'
                        ]?.[0]?.head_EPRSC_ID}
                    {prescriptionSuccessedModal?.insuranceType === 'salamat' &&
                        prescriptionSuccessedModal[
                            prescriptionSuccessedModal?.insuranceType + '_prescription'
                        ]?.trackingCode}{' '}
                    با موفقیت ثبت شد.
                </span>
                {prescriptionSuccessedModal?.insuranceType === 'salamat' && (
                    <span>
                        کدتوالی: {prescriptionSuccessedModal?.salamat_prescription?.sequenceNumber}
                    </span>
                )}
            </Modal>
            <Modal
                title="نسخه شما در صف ارسال قرار گرفت"
                isOpen={prescriptionPendingModal}
                onClose={setPrescriptionPendingModal}
            >
                <span style={{ textAlign: 'justify', lineHeight: '2.5rem' }}>
                    به محض اتصال مجدد ارتباط با سازمان بیمه گر، نسخه ارسال و به وسیله پیامک به شما و
                    بیمار اطلاع داده خواهد شد.
                </span>
            </Modal>
            <TurnTime isOpen={turnTimeModal} setIsOpen={setTurnTimeModal} />
        </>
    );
};

export default Turning;
