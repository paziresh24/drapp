import TextField from '@paziresh24/shared/ui/textField';
import styles from './userName.module.scss';
import Button from '@paziresh24/shared/ui/button/index';
import { useResendCode, useCreateCenter } from '@paziresh24/hooks/drapp/auth';
import { useState, useEffect, useRef } from 'react';
import { sendEvent } from '@paziresh24/shared/utils/sendEvent';
import { digitsFaToEn } from '@paziresh24/shared/utils/digitsFaToEn';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { isMobile } from 'react-device-detect';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { InfoIcon } from '@paziresh24/shared/icon';

const UserName = ({ setStep, step, userName, setUserName, setUserIsPassword, setFocus }) => {
    const resendCode = useResendCode({ mobile: userName, justDoctor: true });
    const createCenter = useCreateCenter();
    const [error, setError] = useState(false);

    // form
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const cellPhoneField = useRef();
    const cellPhoneRegister = register('cellPhone', {
        required: true,
        maxLength: 11
    });
    const nationalCodeField = useRef();
    const nationalCodeRegister = register('nationalCode', {
        required: step === 'REGISTER' && window.location.pathname !== '/p24auth',
        maxLength: 10,
        minLength: 10
    });
    const medicalCodeField = useRef();
    const medicalCodeRegister = register('medicalCode', {
        required: step === 'REGISTER'
    });

    useEffect(() => {
        !isMobile && cellPhoneField.current.focus();
        if (step === 'REGISTER') {
            medicalCodeField.current.focus();
        }
    }, [step]);

    const checkPhone = cellPhone => {
        const number = digitsFaToEn(cellPhone);
        const rgx = /^(\+98|0)?9\d{9}$/;

        if (rgx.test(number)) return true;
        return false;
    };

    const resendCodeAction = ({ cellPhone }) => {
        if (checkPhone(cellPhone)) {
            setUserName(
                !digitsFaToEn(cellPhone)?.startsWith('0')
                    ? `0${digitsFaToEn(cellPhone)}`
                    : digitsFaToEn(cellPhone)
            );
            setTimeout(() => resendCode.refetch());
        } else {
            setError(true);
        }
    };

    const createCenterAction = async ({ cellPhone, nationalCode, medicalCode }) => {
        resendCode.remove();
        createCenter.mutate(
            {
                ignore_shahkar: window.location.pathname === '/p24auth',
                mobile: digitsFaToEn(userName),
                nationalCode: digitsFaToEn(nationalCode),
                medical_code: digitsFaToEn(medicalCode)
            },
            {
                onSuccess: data => {
                    sendEvent('doctorReg', 'step1', 'sucsessfulreg');
                    getSplunkInstance().sendEvent({
                        group: 'register',
                        type: 'successful',
                        event: {
                            cellPhone: digitsFaToEn(userName),
                            nationalCode: digitsFaToEn(nationalCode),
                            medicalCode: digitsFaToEn(medicalCode)
                        }
                    });
                    toast.success(data.message);
                    resendCode.refetch();
                },
                onError: error => {
                    sendEvent('doctorReg', 'step1', `unsuccessfulreg ${cellPhone}`);
                    getSplunkInstance().sendEvent({
                        group: 'register',
                        type: 'unsuccessful',
                        event: {
                            cellPhone: digitsFaToEn(userName),
                            nationalCode: digitsFaToEn(nationalCode),
                            medicalCode: digitsFaToEn(medicalCode),
                            error: error.response?.data
                        }
                    });
                    toast.error(error.response?.data.message);
                }
            }
        );
    };

    useEffect(() => {
        if (resendCode.isSuccess) {
            if (!resendCode.data) {
                return setStep('REGISTER');
            }
            if (resendCode.data.message === 'رمز ثابت را وارد کنید.') {
                setStep('PASSWORD');
                setUserIsPassword(true);
            } else {
                setStep('PASSWORD');
                setUserIsPassword(false);
            }
        }
    }, [resendCode.status]);

    return (
        <form
            onSubmit={handleSubmit(step === 'REGISTER' ? createCenterAction : resendCodeAction)}
            className={styles.wrapper}
        >
            <TextField
                type="tel"
                label="شماره موبایل"
                errorText="شماره موبایل اشتباه است."
                defaultValue={userName}
                disabled={step === 'REGISTER'}
                onFocus={() => {
                    setError(false);
                    setFocus && setFocus(true);
                }}
                error={error || errors.cellPhone}
                {...cellPhoneRegister}
                ref={e => {
                    cellPhoneRegister.ref(e);
                    cellPhoneField.current = e;
                }}
            />
            {step === 'REGISTER' && (
                <>
                    <TextField
                        type="tel"
                        label="کدنظام پزشکی"
                        error={errors.medicalCode}
                        {...medicalCodeRegister}
                        ref={e => {
                            medicalCodeRegister.ref(e);
                            medicalCodeField.current = e;
                        }}
                    />
                    <TextField
                        type="tel"
                        label="کدملی"
                        error={errors.nationalCode}
                        {...nationalCodeRegister}
                        ref={e => {
                            nationalCodeRegister.ref(e);
                            nationalCodeField.current = e;
                        }}
                    />
                    <div className="bg-[#eaf0f4] rounded-lg p-3">
                        <span className="text-[#586a79] font-medium text-sm leading-6">
                            <InfoIcon color="#586a79" className="inline-block ml-2" />
                            لازم به ذکر است که مالکیت شماره موبایل وارد شده باید با کد ملی شما تطابق
                            داشته باشد.
                        </span>
                    </div>
                </>
            )}

            <Button block type="submit" loading={resendCode.isLoading || createCenter.isLoading}>
                {step === 'REGISTER' ? 'ثبت نام' : 'ورود/ثبت نام'}
            </Button>
        </form>
    );
};

export default UserName;