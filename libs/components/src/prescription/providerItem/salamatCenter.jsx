import styles from './providerItem.module.scss';

import Chips from '../../core/chips';
import Modal from '../../core/modal';
import { useState } from 'react';
import { useEffect } from 'react';
import { sendEvent, toEnglishNumber } from '@paziresh24/utils';
import TextField from '../../core/textField';
import Button from '../../core/button';
import { useForm } from 'react-hook-form';
import {
    useCreateSalamatDoctor,
    useUpdateSalamatDoctor
} from '@paziresh24/hooks/prescription/insurances';

import { useCheckOtp } from '@paziresh24/hooks/prescription';
import { toast } from 'react-toastify';
import SalamatImport from '../details/ToolBox/Import/salamat';
import isEmpty from 'lodash/isEmpty';
import { useDrApp } from '@paziresh24/context/drapp';
import { isMobile } from 'react-device-detect';
import TaminIcon from '@paziresh24/components/icons/prescription/tamin';
import SalamatIcon from '@paziresh24/components/icons/prescription/salamat';

const SalamatCenter = ({ isAuth, insurance, name, address, refetch, identifier }) => {
    const createSalamatDoctor = useCreateSalamatDoctor();
    const updateSalamatDoctor = useUpdateSalamatDoctor();
    const [isOpen, setIsOpen] = useState(false);
    const [isAuthentication, setIsAuthentication] = useState(false);
    const [otpConfirm, setOtpConfirm] = useState(false);
    const checkOtp = useCheckOtp();
    const [userName, setUserName] = useState();
    const [isImport, setIsImport] = useState(false);
    const [importModal, setImportModal] = useState(false);
    const [info] = useDrApp();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const {
        register: otpRegister,
        handleSubmit: otpHandleSubmit,
        formState: { errors: otpError }
    } = useForm();

    useEffect(() => {
        if (isAuth) {
            setIsAuthentication(true);
        }
    }, [isAuth]);

    const loginAction = data => {
        setUserName(toEnglishNumber(data.username));
        if (isEmpty(insurance)) {
            createSalamatDoctor.mutate(
                {
                    identifier: identifier,
                    medicalCode: toEnglishNumber(data.medicalCode),
                    username: toEnglishNumber(data.username),
                    password: toEnglishNumber(data.password)
                },
                {
                    onSuccess: data => {
                        if (data?.message === 'کد تایید دو مرحله‌ای را ارسال کنید') {
                            setOtpConfirm(true);
                        } else {
                            setIsAuthentication(true);
                            isImport && setImportModal(true);
                            refetch();
                            toast.success('اطلاعات شما ثبت شد.');
                        }
                    },
                    onError: error => {
                        sendEvent('epsubscribe', 'prescription', 'epsubscribe');
                        const statusCode = error.response?.status;
                        if (statusCode === 401) {
                            toast.error('اطلاعات وارد شده نادرست می باشد.');
                        } else {
                            toast.error(error.response.data.message);
                        }
                    }
                }
            );
        } else {
            updateSalamatDoctor.mutate(
                {
                    id: insurance.id,
                    medicalCode: toEnglishNumber(data.medicalCode),
                    username: toEnglishNumber(data.username),
                    password: toEnglishNumber(data.password)
                },
                {
                    onSuccess: data => {
                        if (data?.message == 'کد تایید دو مرحله‌ای را ارسال کنید') {
                            setOtpConfirm(true);
                        } else {
                            setIsAuthentication(true);
                            isImport && setImportModal(true);
                            refetch();
                            toast.success('اطلاعات شما ویرایش شد.');
                        }
                    },
                    onError: error => {
                        sendEvent('epsubscribe', 'prescription', 'epsubscribe');
                        const statusCode = error.response?.status;
                        if (statusCode === 401) {
                            toast.error('اطلاعات وارد شده نادرست می باشد.');
                        } else {
                            toast.error(error.response.data.message);
                        }
                    }
                }
            );
        }
    };

    const otpConfirmAction = data => {
        checkOtp.mutate(
            {
                identifier: identifier,
                medicalCode: toEnglishNumber(userName),
                code: toEnglishNumber(data.otpCode)
            },
            {
                onSuccess: () => {
                    setOtpConfirm(false);
                    toast.success('اطلاعات شما ثبت شد.');
                },
                onError: error => {
                    toast.error(error.response.data.message);
                }
            }
        );
    };

    const providers = {
        tamin: {
            name: 'بیمه تامین اجتماعی',
            icon: <TaminIcon />
        },
        salamat: {
            name: 'بیمه سلامت',
            icon: <SalamatIcon />
        }
    };

    return (
        <div className={styles.centerItem}>
            <div
                style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                }}
                onClick={() => setIsOpen(prev => !prev)}
                aria-hidden
            >
                <div className={styles.centerInfo}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {isMobile && (
                            <div className={styles['provider-name']}>
                                <SalamatIcon /> <span>بیمه سلامت</span>
                            </div>
                        )}
                        {!isMobile && <span className={styles.centerName}>{name}</span>}
                        <svg
                            width="16"
                            height="17"
                            viewBox="0 0 16 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M11.5308 4.02608C11.7901 3.76669 12.2107 3.7667 12.4701 4.02609C12.7294 4.28547 12.7294 4.706 12.4701 4.96538L12.0076 5.42782C11.5077 5.39169 11.1044 4.98848 11.0683 4.48855L11.5308 4.02608ZM9.89609 5.66072L5.43088 10.1259C4.62411 10.9326 4.32353 11.2421 4.11738 11.6061C3.9618 11.8809 3.8606 12.1858 3.70134 12.7947C4.31025 12.6355 4.61515 12.5343 4.88995 12.3787C5.25403 12.1726 5.56344 11.872 6.3702 11.0652L10.8354 6.60002C10.4453 6.37627 10.1199 6.05086 9.89609 5.66072ZM13.5307 2.96545C12.6856 2.12026 11.3153 2.12024 10.4701 2.96541L4.37023 9.06522L4.29668 9.13874C3.58832 9.84682 3.13084 10.3041 2.81208 10.8671C2.49333 11.4301 2.33657 12.0576 2.09384 13.0294L2.06863 13.1302L1.9394 13.6472C1.87551 13.9028 1.95039 14.1731 2.13668 14.3594C2.32296 14.5457 2.59333 14.6206 2.84891 14.5567L3.36586 14.4275L3.46675 14.4022C4.43846 14.1595 5.06602 14.0028 5.629 13.684C6.19197 13.3653 6.64926 12.9078 7.35733 12.1994L7.35734 12.1994L7.43086 12.1259L13.5307 6.02604C14.3759 5.18088 14.3759 3.81062 13.5307 2.96545Z"
                                fill="#27BDA0"
                            />
                        </svg>
                    </div>
                    {!isMobile && <span className={styles.centerAddress}>{address}</span>}
                    {isMobile && <span className={styles.centerAddress}>{name}</span>}
                </div>
                {isAuthentication ? (
                    <Chips theme="sucsess">احراز هویت شده</Chips>
                ) : (
                    <Chips theme="error">احراز هویت نشده</Chips>
                )}
            </div>

            {isOpen && (
                <form
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: '1rem',
                        width: '100%'
                    }}
                    onSubmit={handleSubmit(loginAction)}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: '1rem'
                        }}
                    >
                        <TextField
                            defaultValue={insurance?.medicalCode ?? info.doctor.medical_code}
                            label="کد نظارم پزشکی"
                            error={errors.medicalCode}
                            {...register('medicalCode', { required: true })}
                        />
                        <div style={{ display: 'flex', width: '100%', gap: '1rem' }}>
                            <TextField
                                defaultValue={insurance && insurance.username}
                                label="نام کاربری"
                                error={errors.nationalCode}
                                {...register('username', { required: true })}
                            />
                            <TextField
                                type="password"
                                defaultValue={insurance && insurance.password}
                                label="رمز عبور"
                                error={errors.mobileNo}
                                {...register('password', { required: true })}
                            />
                        </div>
                    </div>
                    <div
                        className="flex w-full space-y-2 lg:space-y-0 lg:space-s-5 flex-col lg:flex-row lg:justify-between "
                        style={{
                            display: 'flex',
                            width: '100%',
                            gap: '1rem',
                            justifyContent: 'space-between'
                        }}
                    >
                        <div
                            className="flex space-s-2 items-center cursor-pointer"
                            style={{
                                display: 'flex',
                                gap: '1rem',
                                cursor: 'pointer',
                                alignItems: 'center'
                            }}
                        >
                            <label className={`${styles.checkbox} ${styles.bounce}`}>
                                <input
                                    type="checkbox"
                                    id="salamatImportCheckbox"
                                    value={isImport}
                                    onChange={() => setIsImport(prev => !prev)}
                                />
                                <svg viewBox="0 0 21 21">
                                    <polyline points="5 10.75 8.5 14.25 16 6" />
                                </svg>
                            </label>
                            <label htmlFor="salamatImportCheckbox" className={styles.importLabel}>
                                انتقال پراستفاده های من از پنل سلامت
                            </label>
                        </div>

                        <Button
                            className="self-end "
                            size="small"
                            style={{ padding: '0 5rem' }}
                            type="submit"
                            loading={createSalamatDoctor.isLoading || updateSalamatDoctor.isLoading}
                        >
                            ثبت
                        </Button>
                    </div>
                </form>
            )}

            <Modal
                isOpen={otpConfirm}
                onClose={setOtpConfirm}
                title="کد تایید ارسال شده را وارد نمایید."
                id="salamatOtp"
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
            <SalamatImport isOpen={importModal} onClose={setImportModal} provider="salamat" />
        </div>
    );
};

export { SalamatCenter };
