/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import styles from '@assets/styles/pages/drApp/turning.module.scss';
import { SelectDate } from '@components/molecules/turning/selectDate';
import { useGetTurns } from '@paziresh24/hooks/drapp/turning';
import { useDrApp } from '@paziresh24/context/drapp';
import { EmptyState } from '@paziresh24/shared/ui/emptyState';
import { toast } from 'react-toastify';
import Button from '@paziresh24/shared/ui/button';
import TextField from '@paziresh24/shared/ui/textField';
import Modal from '@paziresh24/shared/ui/modal';
import {
    CalendarPlus,
    CircleTick,
    TurningIcon,
    PlusIcon,
    PlusLineIcon
} from '@paziresh24/shared/icon';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useAddPrescription, useCheckOtp } from '@paziresh24/hooks/prescription';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import moment from 'jalali-moment';
import { TurnTime } from '@components/molecules/turning/turnTime';
import { sendEvent } from '@paziresh24/shared/utils/sendEvent';
import { digitsFaToEn } from '@paziresh24/shared/utils/digitsFaToEn';
import { v4 as uuid } from 'uuid';
import { useUpdatePrescription } from '@paziresh24/hooks/prescription/types';
import Error from '@paziresh24/shared/ui/error';
import { getCookie, setCookie } from '@paziresh24/utils/cookie';
import Visit from '@components/molecules/turning/visit';
import { Default, Mobile } from '@paziresh24/hooks/core/device';
import { useMediaQuery } from 'react-responsive';
import TurnsList from '@components/molecules/turning/tutnsList/default';
import { useTour } from '@reactour/tour';
import queryString from 'query-string';
import updatingImage from '@paziresh24/assets/images/drapp/updating.jpg';
import isEmpty from 'lodash/isEmpty';
import debounce from 'lodash/debounce';
import { queryClient } from '@paziresh24/shared/ui/provider';
import ReferenceModal from '@paziresh24/apps/prescription/components/molecules/referenceModal';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

const Turning = () => {
    const history = useHistory();
    const location = useLocation();
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [info] = useDrApp();
    const [openNewTurn, setOpenNewTurn] = useState(false);
    const addPrescription = useAddPrescription();
    const [date, setDate] = useState(
        getCookie('turning_date') ? JSON.parse(getCookie('turning_date')) : null
    );
    const [moveDeleteModal, setMoveDeleteModal] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const getTurn = useGetTurns({
        baseURL: info.center.local_base_url,
        ...((info.center.local_base_url || window._env_.P24_IS_LOCAL_CENTER) && {
            is_direct: 1
        }),
        center_id: info.center.id,
        date:
            moment
                .from(`${date?.year}/${date?.month}/${date?.day}`, 'fa', 'JYYYY/JMM/JDD')
                .format('x') / 1000,
        search: searchValue,
        user_id: info.center.user_info_id
    });
    const [turnTimeModal, setTurnTimeModal] = useState(false);
    const uuidInstance = uuid();
    const [confirmCellPhone, setConfirmCellPhone] = useState(null);
    const checkOtp = useCheckOtp();
    const [otpConfirm, setOtpConfirm] = useState(false);
    const { setIsOpen: tourState, setCurrentStep: setSteps } = useTour();
    const [prescriptionSuccessedModal, setPrescriptionSuccessedModal] = useState(false);
    const [error, setIsError] = useState(false);
    const nationalCodeRef = useRef();
    const [prescriptionPendingModal, setPrescriptionPendingModal] = useState(false);
    const [referenceModal, setReferenceModal] = useState(false);

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

    const openNewTurnAction = useCallback(() => {
        sendEvent('plususer', 'prescription', 'plususer');
        setOpenNewTurn(true);
        resetTurnForm();
        setConfirmCellPhone(null);
        setTimeout(() => nationalCodeRef.current.focus(), 0);
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
        refetchData();
    }, [info.center]);

    const onChangeSearch = debounce(
        e => {
            setSearchValue(e.target.value);
            getTurn.remove();
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
                getTurn.refetch();
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
                patientNationalCode: digitsFaToEn(data.national_code),
                identifier: uuidInstance,
                tags: tags
            },
            {
                onSuccess: data => {
                    getSplunkInstance().sendEvent({
                        group: 'turning-list',
                        type: 'prescription-action'
                    });
                    if (data?.message === 'کد تایید دو مرحله‌ای را ارسال کنید') {
                        return setOtpConfirm(true);
                    }
                    if (data.result.insuranceType === 'tamin' && data.result.patientCell === null) {
                        tourState(false);
                        return setConfirmCellPhone(data.result);
                    }
                    getTurn.remove();
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
                    getSplunkInstance().sendEvent({
                        group: 'turning-list',
                        type: 'prescription-action-error',
                        event: { error: error.response.data }
                    });
                    if (error.response.data.message === 'کد تایید دو مرحله‌ای را ارسال کنید') {
                        return setOtpConfirm(true);
                    }
                    toast.error(error.response.data.message);
                    if (
                        error.response.data.message ===
                        'بیمار دارای بیمه تامین اجتماعی می‌باشد. برای تجویز، از قسمت بیمه‌های من احراز هویت کنید.'
                    ) {
                        history.push('/providers');
                    }
                    if (
                        error.response.data.message ===
                        'بیمار دارای بیمه سلامت می‌باشد. برای تجویز، از قسمت بیمه‌های من احراز هویت کنید.'
                    ) {
                        history.push('/providers');
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
                patientNationalCode: digitsFaToEn(data.national_code),
                identifier: uuidInstance,
                tags: tags
            },
            {
                onSuccess: data => {
                    if (data?.message === 'کد تایید دو مرحله‌ای را ارسال کنید') {
                        return setOtpConfirm(true);
                    }
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
                        history.push('/providers');
                    }
                    if (
                        error.response.data.message ===
                        'بیمار دارای بیمه سلامت می‌باشد. برای تجویز، از قسمت بیمه‌های من احراز هویت کنید.'
                    ) {
                        history.push('/providers');
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
                patientCell: digitsFaToEn(data.cell)
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

    const { ref, ...rest } = addBookRegisterFrom('national_code', {
        required: true,
        maxLength: 12,
        minLength: 10
    });

    const statisticsRef = useRef();
    const headerRef = useRef();

    var observer = new IntersectionObserver(
        function (entries) {
            if (headerRef.current) {
                // no intersection
                if (entries[0].intersectionRatio === 0)
                    headerRef.current.classList.add(styles.sticky);
                // fully intersects
                else if (entries[0].intersectionRatio === 1)
                    headerRef.current.classList.remove(styles.sticky);
            }
        },
        {
            threshold: [0, 1]
        }
    );

    useEffect(() => {
        !isMobile && observer.observe(statisticsRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    const statisticsTurns = {
        allPatientsToday: () => {
            return getTurn?.data?.data?.length;
        },
        activePatientsToday: () => {
            return getTurn.data?.data?.filter(item =>
                item.type === 'prescription' ? !item.finalized : !item.prescription?.finalized
            )?.length;
        },
        visitedPatientsToday: () => {
            return getTurn?.data?.data?.filter(turn =>
                turn.type === 'prescription'
                    ? turn.finalized
                    : turn.prescription?.finalized ?? turn.book_status === 'visited'
            )?.length;
        }
    };

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
                <div
                    ref={statisticsRef}
                    className="hidden lg:flex space-s-6 justify-center mb-3 pt-8"
                >
                    <div className="h-14 rounded-lg flex justify-center items-center px-4 bg-[#ebeff8]">
                        <TurningIcon />
                        <span className="font-bold mr-2 ml-2">تعداد بیماران امروز</span>
                        <span className="font-medium">
                            {getTurn.isSuccess && statisticsTurns.allPatientsToday()} بیمار
                        </span>
                    </div>
                    <div className="h-14 rounded-lg flex justify-center items-center px-4 bg-[#ebeff8]">
                        <svg
                            width="25"
                            height="25"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.75 12C3.75 7.44365 7.44365 3.75 12 3.75C16.5563 3.75 20.25 7.44365 20.25 12C20.25 16.5563 16.5563 20.25 12 20.25C7.44365 20.25 3.75 16.5563 3.75 12ZM12 2.25C6.61522 2.25 2.25 6.61522 2.25 12C2.25 17.3848 6.61522 21.75 12 21.75C17.3848 21.75 21.75 17.3848 21.75 12C21.75 6.61522 17.3848 2.25 12 2.25ZM16.5303 9.53033C16.8232 9.23744 16.8232 8.76256 16.5303 8.46967C16.2374 8.17678 15.7626 8.17678 15.4697 8.46967L11 12.9393L9.53033 11.4697C9.23744 11.1768 8.76256 11.1768 8.46967 11.4697C8.17678 11.7626 8.17678 12.2374 8.46967 12.5303L10.4697 14.5303C10.6103 14.671 10.8011 14.75 11 14.75C11.1989 14.75 11.3897 14.671 11.5303 14.5303L16.5303 9.53033Z"
                                fill="#27BDA0"
                            />
                        </svg>
                        <span className="font-bold mr-2 ml-2">بیماران ویزیت شده</span>
                        <span className="font-medium">
                            {getTurn.isSuccess && statisticsTurns.visitedPatientsToday()} بیمار
                        </span>
                    </div>
                    <div className="h-14 rounded-lg flex justify-center items-center px-4 bg-[#ebeff8]">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M15.9466 3.86296C15.0496 3.75142 13.7844 3.75 12.0003 3.75H9.36429C8.71829 3.75 8.261 3.75021 7.91998 3.76649C7.56474 3.78345 7.4243 3.81587 7.37132 3.83671C6.71239 4.09582 6.40002 4.84996 6.68273 5.49911C6.70546 5.55131 6.78184 5.67354 7.02104 5.93673C7.25066 6.18938 7.57387 6.51287 8.03066 6.96967L10.2807 9.21967C10.5736 9.51256 10.5736 9.98744 10.2807 10.2803C9.98777 10.5732 9.51289 10.5732 9.22 10.2803L6.97 8.03033L6.95532 8.01565C6.51646 7.57679 6.16765 7.22799 5.911 6.9456C5.66108 6.67061 5.43613 6.39341 5.30749 6.09804C4.68553 4.66992 5.37276 3.0108 6.82238 2.44076C7.1222 2.32286 7.47728 2.28592 7.84845 2.2682C8.22961 2.25 8.72291 2.25 9.34358 2.25H9.36429H12.0003L12.058 2.25C13.7717 2.24998 15.1309 2.24997 16.1317 2.37443C17.1139 2.49657 18.0242 2.76512 18.5121 3.55566C18.6667 3.80623 18.7801 4.08002 18.848 4.36655C19.0619 5.27056 18.6082 6.1041 18.0001 6.88497C17.3804 7.68066 16.4192 8.64178 15.2075 9.85352L15.1667 9.89429L9.89462 15.1664C8.63308 16.4279 7.73943 17.3236 7.18405 18.0367C6.61019 18.7736 6.56933 19.1061 6.61237 19.2879C6.6432 19.4182 6.69475 19.5426 6.76505 19.6565C6.8632 19.8155 7.12722 20.0218 8.05404 20.137C8.95102 20.2486 10.2162 20.25 12.0003 20.25H14.6364C15.2824 20.25 15.7397 20.2498 16.0807 20.2335C16.4359 20.2165 16.5764 20.1841 16.6293 20.1633C17.2883 19.9042 17.6006 19.15 17.3179 18.5009C17.2952 18.4487 17.2188 18.3265 16.9796 18.0633C16.75 17.8106 16.4268 17.4871 15.97 17.0303L13.72 14.7803C13.4271 14.4874 13.4271 14.0126 13.72 13.7197C14.0129 13.4268 14.4878 13.4268 14.7807 13.7197L17.0307 15.9697L17.0452 15.9843C17.4842 16.4232 17.833 16.772 18.0897 17.0544C18.3396 17.3294 18.5645 17.6066 18.6932 17.902C19.3151 19.3301 18.6279 20.9892 17.1783 21.5592C16.8785 21.6771 16.5234 21.7141 16.1522 21.7318C15.771 21.75 15.2777 21.75 14.6571 21.75H14.6364H12.0003H11.9427C10.229 21.75 8.86976 21.75 7.86894 21.6256C6.88676 21.5034 5.97651 21.2349 5.48859 20.4443C5.33394 20.1938 5.22053 19.92 5.15271 19.6334C4.93872 18.7294 5.39247 17.8959 6.00061 17.115C6.62029 16.3193 7.58142 15.3582 8.79319 14.1465L8.83396 14.1057L14.106 8.83363C15.3676 7.57209 16.2612 6.67644 16.8166 5.96331C17.3905 5.22645 17.4313 4.89392 17.3883 4.71207C17.3575 4.58183 17.3059 4.45738 17.2356 4.34348C17.1375 4.18445 16.8734 3.97822 15.9466 3.86296Z"
                                fill="#27BDA0"
                            />
                        </svg>
                        <span className="font-bold mr-2 ml-2">بیماران باقی مانده</span>
                        <span className="font-medium">
                            {statisticsTurns.activePatientsToday()} بیمار
                        </span>
                    </div>
                </div>
                {!error && (
                    <div ref={headerRef} className={styles['head-bar']}>
                        <div className={styles.selectDate}>
                            <SelectDate
                                today
                                value={setDate}
                                nagivateDate={isMobile}
                                defaultValue={
                                    getCookie('turning_date') ? getCookie('turning_date') : null
                                }
                            />
                        </div>
                        <hr />

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
                        </div>
                        <Default>
                            <Button onClick={openNewTurnAction}>افزودن بیمار</Button>
                        </Default>
                    </div>
                )}

                <div
                    className={styles['turn-cards']}
                    style={{
                        overflow: getTurn.isLoading && 'hidden'
                    }}
                >
                    {error && (
                        <div className={styles['error-message']}>
                            <img src={updatingImage} alt="" />

                            <span className={styles.errorTitle}>درحال بروز رسانی سامانه هستیم</span>
                            <span>بزودی با تغییرات جدید فعال خواهیم شد.</span>
                        </div>
                    )}

                    {getTurn.isSuccess && isEmpty(getTurn?.data?.data) && (
                        <EmptyState text="نوبتی وجود ندارد" />
                    )}

                    {getTurn.isError && (
                        <Error
                            error={getTurn.error?.response?.data?.message}
                            message={`خطا در دریافت نوبت های ${info.center.name}`}
                        />
                    )}

                    <TurnsList
                        turns={getTurn.isSuccess ? getTurn?.data?.data : []}
                        loading={getTurn.isLoading}
                        refetchData={refetchData}
                    />

                    <Mobile>
                        <div className={styles['add-turn-button-mask']} />
                        <button className={styles['add-turn-button']} onClick={openNewTurnAction}>
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
                        onKeyDown={e => e.keyCode === 13 && addBookSubmit(addBookAction)()}
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
                    <span
                        style={{
                            textDecoration: 'underLine',
                            opacity: '0.8',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                        onClick={() => setReferenceModal(true)}
                    >
                        پذیرش از مسیر ارجاع
                    </span>
                    <div className="flex space-s-3">
                        {!isEmpty(confirmCellPhone) && (
                            <Button
                                block
                                onClick={addBookSubmit(updateCellPhone)}
                                loading={
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

            <ReferenceModal
                isOpen={referenceModal}
                onClose={setReferenceModal}
                nationalCodeDefaultValue={nationalCodeRef.current?.value}
            />

            {/* <TurnTime isOpen={turnTimeModal} setIsOpen={setTurnTimeModal} /> */}
        </>
    );
};

export default Turning;
