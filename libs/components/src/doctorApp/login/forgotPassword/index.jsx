import TextField from '../../../core/textField';
import styles from './forgotPassword.module.scss';
import { useState, useRef, useEffect } from 'react';
import Button from '../../../core/button';
import { useResendCode } from '@paziresh24/hooks/drapp/auth';
import { useForm } from 'react-hook-form';

const ForgotPassword = ({ userName, loginAction, loginLoading }) => {
    const [timer, setTimer] = useState(59);
    let interval = useRef(null);
    const resendCode = useResendCode({ mobile: userName, justDoctor: true, force: true });

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const passWordField = useRef();
    const passwordRegister = register('password', {
        required: true
    });

    useEffect(() => {
        passWordField.current.focus();
    }, []);

    useEffect(() => {
        resendCodeAction();
        clearInterval(interval);
        interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);
    }, []);

    const resendCodeAction = () => {
        resendCode.refetch();
    };

    const passwordAction = ({ password }) => {
        loginAction(userName, password, true);
    };

    return (
        <form className={styles.wrapper} onSubmit={handleSubmit(passwordAction)}>
            <span className={styles.hint}>
                کد ارسال شده به شماره موبایل {userName} را وارد کنید.
            </span>
            <div className={styles['code-wrapper']}>
                <TextField
                    type="tel"
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    label="کد"
                    style={{ direction: 'ltr' }}
                    error={errors.password}
                    {...passwordRegister}
                    ref={e => {
                        passwordRegister.ref(e);
                        passWordField.current = e;
                    }}
                />

                <div
                    className={`
                        ${styles['timer']}
                        ${timer <= 0 ? styles['resendCode'] : ''}
                    `}
                    onClick={() => {
                        if (timer <= 0) {
                            setTimer(59);
                            resendCodeAction();
                        }
                    }}
                    aria-hidden
                >
                    {timer <= 0 ? <span>ارسال مجدد</span> : `00:${timer}`}
                </div>
            </div>
            <Button block type="submit" loading={loginLoading}>
                ورود
            </Button>
        </form>
    );
};

export default ForgotPassword;
