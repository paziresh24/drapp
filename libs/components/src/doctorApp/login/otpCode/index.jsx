import TextField from '../../../core/textField';
import styles from './otpCode.module.scss';
import { useState, useRef, useEffect } from 'react';
import Button from '../../../core/button';
import { useResendCode } from '@paziresh24/hooks/drapp/auth';
import { useForm } from 'react-hook-form';
import { toEnglishNumber } from '@paziresh24/utils';
import Captcha from '../../../doctorApp/login/captcha';

const OtoCode = ({ userName, loginAction, loginLoading, wrongPassword }) => {
    const [timer, setTimer] = useState(59);
    const [captcha, setCaptcha] = useState(null);
    const [captchaError, setCaptchaError] = useState(false);

    let interval = useRef(null);
    const resendCode = useResendCode({ mobile: userName, justDoctor: true });

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
        // resendCodeAction();
        clearInterval(interval);
        interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);
    }, []);

    const resendCodeAction = () => {
        resendCode.refetch();
    };

    const passwordAction = ({ password }) => {
        if (wrongPassword && !captcha) return setCaptchaError(true);

        loginAction(userName, toEnglishNumber(password), false, captcha);
    };

    return (
        <form className="flex flex-col space-y-2" onSubmit={handleSubmit(passwordAction)}>
            <span className="text-sm font-medium text-[#678093] leading-8">
                کد ارسال شده به شماره موبایل {userName} را وارد کنید.
            </span>
            <div className="flex items-center">
                <TextField
                    type="tel"
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    label="کد"
                    style={{
                        direction: 'ltr',
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0
                    }}
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
            {wrongPassword && <Captcha error={captchaError} captchaEntered={setCaptcha} />}
            <Button block type="submit" loading={loginLoading}>
                ورود
            </Button>
        </form>
    );
};

export default OtoCode;
