import styles from './form.module.scss';

import { useCheckOtp, useImportRequests } from '@paziresh24/hooks/prescription';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import providers from '@paziresh24/constants/prescription.json';

import TextField from '@paziresh24/components/core/textField';
import Button from '@paziresh24/components/core/button';

import Modal from '../../../core/modal';
import { digitsFaToEn, sendEvent } from '@paziresh24/utils';
import {
    useCreateSalamatDoctor,
    useCreateTaminDoctor,
    useUpdateSalamatDoctor,
    useUpdateTaminDoctor
} from '@paziresh24/hooks/prescription/insurances';
import { useLearnTour } from '@paziresh24/hooks/learn';
import isEmpty from 'lodash/isEmpty';

const Form = props => {
    const checkOtp = useCheckOtp();
    const { search } = useLocation();
    const [otpConfirm, setOtpConfirm] = useState(false);
    const [userData, setUserData] = useState();
    const params = queryString.parse(search);
    const importRequests = useImportRequests();

    const createSalamatDoctor = useCreateSalamatDoctor();
    const updateSalamatDoctor = useUpdateSalamatDoctor();

    const createTaminDoctor = useCreateTaminDoctor();
    const updateTaminDoctor = useUpdateTaminDoctor();
    const { setSteps, tourState, isTourOpen, isActiveLearn } = useLearnTour();

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

    const [provider, setProvider] = useState(props.provider);
    const [label, setLabel] = useState({
        username: 'نام کاربری',
        password: 'رمز عبور'
    });

    useEffect(() => {
        switch (provider) {
            case providers.salamat:
                setLabel({
                    username: 'نام کاربری*',
                    password: 'رمز عبور*'
                });
                break;
            case providers.tamin:
                setLabel({
                    username: 'کد ملی*',
                    password: 'شماره موبایل*'
                });
                break;
        }
    }, [provider]);

    useEffect(() => {
        if (checkOtp.isError) {
            if (!toast.isActive('designer_refresh'))
                toast.error(checkOtp.error.response.data.message, {
                    toastId: ' designer_refresh '
                });
        }
        if (checkOtp.isSuccess) {
            if (isTourOpen && isActiveLearn) {
                tourState(false);
                window.parent.postMessage(
                    {
                        drappEvent: ['backToTurningLearn']
                    },
                    '*'
                );
            }
            props.loggedIn && props.loggedIn();
            props.onClose(false);
        }
    }, [checkOtp.status]);

    const onSubmit = data => {
        setUserData(data);
        if (props.provider === providers.salamat) {
            if (isEmpty(props.data.find(item => item.identifier === props.identifier))) {
                createSalamatDoctor.mutate(
                    {
                        identifier: props.identifier,
                        medicalCode: digitsFaToEn(data.medicalCode),
                        username: digitsFaToEn(data.username),
                        password: digitsFaToEn(data.password)
                    },
                    {
                        onSuccess: data => {
                            if (data?.message === 'کد تایید دو مرحله‌ای را ارسال کنید') {
                                setSteps(4);
                                setOtpConfirm(true);
                            } else {
                                if (isTourOpen && isActiveLearn) {
                                    tourState(false);
                                    window.parent.postMessage(
                                        {
                                            drappEvent: ['backToTurningLearn']
                                        },
                                        '*'
                                    );
                                }
                                props.loggedIn && props.loggedIn();
                                props.onClose(false);
                            }
                        },
                        onError: error => {
                            sendEvent('epsubscribe', 'prescription', 'epsubscribe');
                            console.clear();
                            const statusCode = error.response?.status;
                            if (statusCode === 401) {
                                if (!toast.isActive('designer_refresh'))
                                    toast.error('اطلاعات وارد شده نادرست می باشد.', {
                                        toastId: ' designer_refresh '
                                    });
                            } else {
                                if (!toast.isActive('designer_refresh'))
                                    toast.error(error.response.data.message, {
                                        toastId: ' designer_refresh '
                                    });
                            }
                        }
                    }
                );
            } else {
                updateSalamatDoctor.mutate(
                    {
                        id: props.data.find(item => item.identifier === props.identifier).id,
                        medicalCode: digitsFaToEn(data.medicalCode),
                        username: digitsFaToEn(data.username),
                        password: digitsFaToEn(data.password)
                    },
                    {
                        onSuccess: data => {
                            if (data?.message == 'کد تایید دو مرحله‌ای را ارسال کنید') {
                                setOtpConfirm(true);
                                setSteps(4);
                            } else {
                                if (isTourOpen && isActiveLearn) {
                                    tourState(false);
                                    window.parent.postMessage(
                                        {
                                            drappEvent: ['backToTurningLearn']
                                        },
                                        '*'
                                    );
                                }
                                props.loggedIn && props.loggedIn();
                                props.onClose(false);
                            }
                        },
                        onError: error => {
                            sendEvent('epsubscribe', 'prescription', 'epsubscribe');
                            console.clear();
                            const statusCode = error.response?.status;
                            if (statusCode === 401) {
                                if (!toast.isActive('designer_refresh'))
                                    toast.error('اطلاعات وارد شده نادرست می باشد.', {
                                        toastId: ' designer_refresh '
                                    });
                            } else {
                                if (!toast.isActive('designer_refresh'))
                                    toast.error(error.response.data.message, {
                                        toastId: ' designer_refresh '
                                    });
                            }
                        }
                    }
                );
            }
        }
        if (props.provider === providers.tamin) {
            if (data.taminUsername && data.taminPassword) {
                importRequests.mutate({
                    provider: providers.tamin,
                    username: digitsFaToEn(data.taminUsername),
                    password: digitsFaToEn(data.taminPassword)
                });
            }

            if (isEmpty(props.data)) {
                createTaminDoctor.mutate(
                    {
                        docId: digitsFaToEn(data.medicalCode),
                        nationalCode: digitsFaToEn(data.username),
                        mobileNo: digitsFaToEn(data.password),
                        username: digitsFaToEn(data.taminUsername),
                        password: digitsFaToEn(data.taminPassword)
                    },
                    {
                        onSuccess: () => {
                            tourState(true);
                            setSteps(2);
                            props.loggedIn && props.loggedIn();
                            props.onClose(false);
                        },
                        onError: error => {
                            sendEvent('epsubscribe', 'prescription', 'epsubscribe');
                            console.clear();
                            const statusCode = error.response?.status;
                            if (statusCode === 401) {
                                if (!toast.isActive('designer_refresh'))
                                    toast.error('اطلاعات وارد شده نادرست می باشد.', {
                                        toastId: ' designer_refresh '
                                    });
                            } else {
                                if (!toast.isActive('designer_refresh'))
                                    toast.error(error.response.data.message, {
                                        toastId: ' designer_refresh '
                                    });
                            }
                        }
                    }
                );
            } else {
                updateTaminDoctor.mutate(
                    {
                        id: props.data.id,
                        docId: digitsFaToEn(data.medicalCode),
                        nationalCode: digitsFaToEn(data.username),
                        mobileNo: digitsFaToEn(data.password),
                        username: digitsFaToEn(data.taminUsername),
                        password: digitsFaToEn(data.taminPassword)
                    },
                    {
                        onSuccess: () => {
                            setSteps(2);
                            props.loggedIn && props.loggedIn();
                            props.onClose(false);
                        },
                        onError: error => {
                            sendEvent('epsubscribe', 'prescription', 'epsubscribe');
                            console.clear();
                            const statusCode = error.response?.status;
                            if (statusCode === 401) {
                                if (!toast.isActive('designer_refresh'))
                                    toast.error('اطلاعات وارد شده نادرست می باشد.', {
                                        toastId: ' designer_refresh '
                                    });
                            } else {
                                if (!toast.isActive('designer_refresh'))
                                    toast.error(error.response.data.message, {
                                        toastId: ' designer_refresh '
                                    });
                            }
                        }
                    }
                );
            }
        }
    };

    const otpConfirmAction = data => {
        checkOtp.mutate({
            identifier: props.identifier,
            medicalCode: digitsFaToEn(userData.medicalCode),
            code: digitsFaToEn(data.otpCode)
        });
    };

    return (
        <>
            <form className={styles['wrapper']} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles['body']}>
                    <TextField
                        type="tel"
                        error={errors.medicalCode}
                        defaultValue={
                            props.data !== null && props.provider === providers.salamat
                                ? props.data?.medicalCode ?? params?.doctor_medical_code
                                : props.data?.docId ?? params?.doctor_medical_code
                        }
                        label="کد نظام پزشکی*"
                        {...register('medicalCode', { required: true })}
                    />
                    <TextField
                        type="text"
                        error={errors.username}
                        defaultValue={
                            props.provider === providers.salamat
                                ? props.data.find(item => item.identifier === props.identifier)
                                      ?.username ?? null
                                : props.data?.nationalCode ?? params?.doctor_national_code
                        }
                        label={label.username}
                        autoComplete="on"
                        {...register('username', { required: true })}
                        style={{ direction: 'ltr' }}
                    />
                    <TextField
                        type="text"
                        id="cell_tamin_step"
                        {...register('password', {
                            required: true
                        })}
                        onChange={e => {
                            e.target.value.length === 11 && setSteps(26);
                        }}
                        onFocus={() => props.provider === 'tamin' && setSteps(25)}
                        error={errors.password}
                        defaultValue={
                            props.provider === providers.salamat ? '' : props.data?.mobileNo
                        }
                        label={label.password}
                        autoComplete="on"
                        style={{ direction: 'ltr' }}
                    />
                    {provider === providers.tamin && !props.noImport && (
                        <div id="username_password_tamin_step" className={styles['body']}>
                            <TextField
                                type="text"
                                error={errors.taminUsername}
                                label="نام کاربری"
                                autoComplete="on"
                                {...register('taminUsername', { required: false })}
                                style={{ direction: 'ltr' }}
                                onFocus={() => tourState(false)}
                            />
                            <TextField
                                type="text"
                                error={errors.taminPassword}
                                label="رمز عبور"
                                autoComplete="on"
                                {...register('taminPassword', { required: false })}
                                style={{ direction: 'ltr' }}
                                onFocus={() => tourState(false)}
                            />
                        </div>
                    )}
                </div>
                <div className={styles['footer']}>
                    <Button
                        type="submit"
                        icon=""
                        variant="primary"
                        block
                        loading={
                            createTaminDoctor.isLoading ||
                            createSalamatDoctor.isLoading ||
                            updateSalamatDoctor.isLoading ||
                            updateTaminDoctor.isLoading ||
                            importRequests.isLoading
                        }
                    >
                        ورود
                    </Button>
                </div>
            </form>
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
        </>
    );
};

export default Form;
