import TextField from '@paziresh24/shared/ui/textField';
import styles from './salamatLogin.module.scss';
import Button from '@paziresh24/shared/ui/button/index';
import { useCreateCenter, useSalamatLogin } from '@paziresh24/hooks/drapp/auth';
import { useEffect, useRef, useState } from 'react';
import { digitsFaToEn } from '@paziresh24/shared/utils/digitsFaToEn';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { setToken } from '@paziresh24/utils/localstorage';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { removeZeroStartNumber } from 'apps/drapp/src/functions/removeZeroStartNumber';

const SalamatLogin = ({ step }) => {
    const history = useHistory();
    const salamatLogin = useSalamatLogin();
    const createCenterReq = useCreateCenter();
    const { search } = useLocation();
    const [localStep, setLocalStep] = useState(step);
    const params = queryString.parse(search);
    // form
    const {
        register: salamatLoginRegister,
        handleSubmit: salamatLoginHandleSubmit,
        formState: { errors: salamatLoginErrors }
    } = useForm();
    const {
        register: createCenterRegister,
        handleSubmit: createCenterHandleSubmit,
        formState: { errors: createCenterErrors }
    } = useForm();
    const cellField = useRef();
    const cellRegister = createCenterRegister('cellPhone', {
        required: true
    });
    const nationalCodeField = useRef();
    const nationalCodeRegister = createCenterRegister('nationalCode', {
        required: true
    });
    const usernameField = useRef();
    const usernameRegister = salamatLoginRegister('username', {
        required: true
    });
    const passwordField = useRef();
    const passwordRegister = salamatLoginRegister('password', {
        required: true
    });

    useEffect(() => {
        localStep === 'SALAMATAUTH' && usernameField.current.focus();
    }, []);

    const handleCreateCenter = async ({ cellPhone, nationalCode }) => {
        try {
            await createCenter({
                cellPhone: digitsFaToEn(cellPhone),
                nationalCode: digitsFaToEn(nationalCode)
            });
            getSplunkInstance().sendEvent({
                group: 'register',
                type: 'successful-salamat',
                event: {
                    cellPhone: digitsFaToEn(cellPhone),
                    nationalCode: digitsFaToEn(nationalCode),
                    username: usernameField.current.value
                }
            });
            handleLogin({
                username: usernameField.current.value,
                password: passwordField.current.value
            });
        } catch (error) {
            getSplunkInstance().sendEvent({
                group: 'register',
                type: 'unsuccessful-salamat',
                event: {
                    cellPhone: digitsFaToEn(cellPhone),
                    nationalCode: digitsFaToEn(nationalCode),
                    username: usernameField.current.value,
                    error: error.response.data
                }
            });
            toast.error(error.response?.data.message);
        }
    };

    const createCenter = async ({ cellPhone, nationalCode }) => {
        return createCenterReq.mutateAsync({
            ignore_shahkar: true,
            mobile: removeZeroStartNumber(digitsFaToEn(cellPhone)),
            nationalCode: digitsFaToEn(nationalCode)
        });
    };

    const handleLogin = async ({ username, password }) => {
        salamatLogin.mutate(
            {
                username: digitsFaToEn(username),
                password: digitsFaToEn(password)
            },
            {
                onSuccess: data => {
                    getSplunkInstance().sendEvent({
                        group: 'login',
                        type: 'successful-salamat',
                        event: {
                            username: digitsFaToEn(username)
                        }
                    });

                    if (params?.url && new URL(params?.url).origin === location.origin) {
                        return location.replace(decodeURIComponent(params.url));
                    }

                    return history.replace({
                        pathname: '/',
                        state: {
                            afterLogin: true
                        }
                    });
                },
                onError: error => {
                    getSplunkInstance().sendEvent({
                        group: 'login',
                        type: 'unsuccessful-salamat',
                        event: {
                            username: digitsFaToEn(username),
                            error: error.response.data
                        }
                    });
                    if (error.response.data.message === 'user not found') {
                        return setLocalStep('CREATE_CENTER');
                    }
                    if (error.response.data.message === 'Salamat-Unauthorized') {
                        return toast.error('نام کاربری یا کلمه عبور اشتباه است');
                    }
                    toast.error(error.response.data.message);
                }
            }
        );
    };

    return (
        <>
            <form
                onSubmit={salamatLoginHandleSubmit(handleLogin)}
                className={`${styles.wrapper} ${localStep !== 'SALAMATAUTH' ? '!hidden' : ''}`}
            >
                <TextField
                    type="tel"
                    label="نام کاربری"
                    error={salamatLoginErrors.username}
                    {...usernameRegister}
                    ref={e => {
                        usernameRegister.ref(e);
                        usernameField.current = e;
                    }}
                    testId="salamat-login-username-field"
                />
                <TextField
                    type="tel"
                    label="رمز عبور"
                    error={salamatLoginErrors.password}
                    {...passwordRegister}
                    ref={e => {
                        passwordRegister.ref(e);
                        passwordField.current = e;
                    }}
                    testId="salamat-login-password-field"
                />
                <Button
                    block
                    type="submit"
                    loading={salamatLogin.isLoading}
                    testId="salamat-login-login-button"
                >
                    ورود
                </Button>
            </form>
            {localStep === 'CREATE_CENTER' && (
                <form
                    onSubmit={createCenterHandleSubmit(handleCreateCenter)}
                    className={styles.wrapper}
                >
                    <TextField
                        type="tel"
                        label="شماره موبایل"
                        errorText="شماره موبایل اشتباه است."
                        {...cellRegister}
                        ref={e => {
                            cellRegister.ref(e);
                            cellField.current = e;
                        }}
                        testId="create-center-cell-phone-field"
                    />
                    <TextField
                        type="tel"
                        label="کدملی"
                        error={createCenterErrors.nationalCode}
                        {...nationalCodeRegister}
                        ref={e => {
                            nationalCodeRegister.ref(e);
                            nationalCodeField.current = e;
                        }}
                        testId="create-center-national-code-field"
                    />
                    <Button
                        block
                        type="submit"
                        loading={createCenterReq.isLoading || salamatLogin.isLoading}
                        testId="create-center-submit-button"
                    >
                        ثبت نام
                    </Button>
                </form>
            )}
        </>
    );
};

export default SalamatLogin;
