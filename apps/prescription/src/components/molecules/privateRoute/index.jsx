import { toast } from 'react-toastify';
import { client } from '../../../apis/prescription/client';
import styles from '../../prescription/auth/form/form.module.scss';

// HOOKS
import { Route, useHistory, useLocation } from 'react-router-dom';
import {
    useCheckOtp,
    useClinicLogin,
    useGetLatestVersion,
    useGetMe
} from '../../../hooks/prescription/index';
import { useMe } from '@paziresh24/context/prescription/me-context';
import { useEffect, useState } from 'react';
import {
    GETـPRESCRIPTIONـTOKEN,
    CLEAR_PRESCRIPTIONـTOKEN
} from '@paziresh24/utils/services/prescription/localstorage.js';

import queryString from 'query-string';
import { useToken } from '@paziresh24/context/prescription/token.context';
import { Loading } from '../loading';

import TextField from '@paziresh24/shared/ui/textField';
import Button from '@paziresh24/shared/ui/button';

import Modal from '@paziresh24/shared/ui/modal';

import * as serviceWorkerRegistration from '../../../serviceWorkerRegistration';

import { useForm } from 'react-hook-form';
import LearnControl from '../learnControl/index';

const PrivateRoute = props => {
    const [me, setMe] = useMe();
    const getMe = useGetMe();
    const history = useHistory();
    const { search } = useLocation();
    const urlParams = queryString.parse(search);
    const clinicLogin = useClinicLogin({ access_token: urlParams.access_token });
    const getLatestVersion = useGetLatestVersion();
    const checkOtp = useCheckOtp();
    const [otpConfirm, setOtpConfirm] = useState(false);

    const {
        register: otpRegister,
        handleSubmit: otpHandleSubmit,
        formState: { errors: otpError }
    } = useForm();

    useEffect(() => {
        return clinicLogin.refetch();
    }, []);

    useEffect(() => {
        if (
            getLatestVersion.isSuccess &&
            getLatestVersion.data.name !== localStorage.getItem('PRESCRIPTION_APP_VERSION')
        ) {
            localStorage.setItem('PRESCRIPTION_APP_VERSION', getLatestVersion.data.name);
            if ('serviceWorker' in navigator) {
                caches.keys().then(keys =>
                    keys.forEach(key =>
                        caches.delete(key).then(() => {
                            serviceWorkerRegistration.unregister();
                            window.location.reload();
                        })
                    )
                );
            }
        }
    }, [getLatestVersion.status]);

    useEffect(() => {
        if (getMe.isError) {
            const statusCode = getMe.error.response?.status;
            if (statusCode === 401) {
                return history.replace('/providers/');
            } else {
                // toast.error('خطا در دریافت اطلاعات.');
            }
        }
        if (getMe.isSuccess) {
            setMe(getMe.data);
        }
    }, [getMe.status]);

    useEffect(() => {
        if (clinicLogin.isSuccess) {
            setTimeout(() => getMe.refetch());
            // localStorage.setItem('prescription_token', clinicLogin.data.jwt);
        }
        if (clinicLogin.isError) {
            toast.error(clinicLogin.error.response.data.message);
        }
    }, [clinicLogin.status]);

    // onRequest
    client.interceptors.request.use(
        config => {
            config.headers['Content-Type'] = 'application/json';
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );

    const otpConfirmAction = data => {
        checkOtp.mutate(
            {
                identifier: urlParams.identifier,
                // medicalCode: me.salamat_doctor.medicalCode,
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

    return (
        <>
            <Route {...props} />
            <LearnControl />
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
        </>
    );
};

export default PrivateRoute;
