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
import { InfoIcon, LoadingIcon } from '@paziresh24/shared/icon';
import Modal from '@paziresh24/shared/ui/modal';
import { useCreateCenterIntelligence } from 'apps/drapp/src/apis/center/createCenterIntelligence';
import { Loading } from '@paziresh24/shared/ui/loading';

const UserName = ({ setStep, step, userName, setUserName, setUserIsPassword, setFocus }) => {
    const resendCode = useResendCode({ mobile: userName, justDoctor: true });
    const createCenter = useCreateCenter();
    const [error, setError] = useState(false);
    const [intelligenceCreateCenterModal, setIntelligenceCreateCenterModal] = useState(false);
    const createCenterIntelligence = useCreateCenterIntelligence();

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
                    if (
                        error.response?.data?.message ===
                        'مالکیت شماره موبایل وارد شده با کدملی شما تطابق ندارد.'
                    ) {
                        setIntelligenceCreateCenterModal(true);
                        return;
                    }
                    toast.error(error.response?.data.message);
                }
            }
        );
    };

    const createCenterWhiteNationalCard = async file => {
        try {
            await createCenterIntelligence.mutateAsync({
                nationalCard: file,
                mobile: digitsFaToEn(userName),
                nationalCode: digitsFaToEn(nationalCodeField.current.value)
            });
            getSplunkInstance().sendEvent({
                group: 'register',
                type: 'successful',
                event: {
                    action: 'with-national-card',
                    cellPhone: digitsFaToEn(userName),
                    nationalCode: digitsFaToEn(nationalCodeField.current.value),
                    medicalCode: digitsFaToEn(medicalCodeField.current.value)
                }
            });
            setIntelligenceCreateCenterModal(false);
            resendCode.refetch();
        } catch (e) {
            getSplunkInstance().sendEvent({
                group: 'register',
                type: 'unsuccessful',
                event: {
                    action: 'with-national-card',
                    cellPhone: digitsFaToEn(userName),
                    nationalCode: digitsFaToEn(nationalCodeField.current.value),
                    medicalCode: digitsFaToEn(medicalCodeField.current.value),
                    error: e.response?.data
                }
            });
            toast.error(e.response?.data.message);
        }
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
        <>
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
                                لازم به ذکر است که مالکیت شماره موبایل وارد شده باید با کد ملی شما
                                تطابق داشته باشد.
                            </span>
                        </div>
                    </>
                )}

                <Button
                    block
                    type="submit"
                    loading={resendCode.isLoading || createCenter.isLoading}
                >
                    {step === 'REGISTER' ? 'ثبت نام' : 'ورود/ثبت نام'}
                </Button>
            </form>
            <Modal
                isOpen={intelligenceCreateCenterModal}
                onClose={setIntelligenceCreateCenterModal}
                noHeader
            >
                <div className="flex flex-col space-y-3">
                    <span className="text-sm font-bold">پزشک گرامی</span>
                    <span className="text-sm font-bold leading-7">
                        باتوجه به اینکه شماره موبایل متعلق به این کد ملی نمی باشد، برای احراز هویت
                        لطفا عکس کارت ملی خود را بارگذاری کنید.
                    </span>
                </div>
                <label
                    htmlFor="nationalCard"
                    className="flex flex-col items-center justify-center w-full h-48 border border-dashed rounded-lg cursor-pointer border-slate-300"
                >
                    {createCenterIntelligence.isLoading || resendCode.isLoading ? (
                        <LoadingIcon color="#000" width="2rem" height="2rem" />
                    ) : (
                        <>
                            <span className="w-3/4 text-sm font-medium text-center text-slate-500">
                                برای بارگذاری کارت ملی خود اینجا کلیک کنید.
                            </span>
                        </>
                    )}
                </label>
                <input
                    id="nationalCard"
                    type="file"
                    className="hidden"
                    accept="image/jpeg, image/png"
                    onChange={e => createCenterWhiteNationalCard(e.target.files[0])}
                />
            </Modal>
        </>
    );
};

export default UserName;
