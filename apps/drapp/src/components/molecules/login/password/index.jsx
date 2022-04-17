import TextField from '@paziresh24/shared/ui/textField';
import Button from '@paziresh24/shared/ui/button/index';
import { useForm } from 'react-hook-form';
import { useRef, useEffect, useState } from 'react';
import Captcha from '../../login/captcha';

const Password = ({ userName, loginAction, loginLoading, wrongPassword }) => {
    const [captcha, setCaptcha] = useState(null);
    const [captchaError, setCaptchaError] = useState(false);

    // form
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

    const passwordAction = ({ password }) => {
        if (wrongPassword && !captcha) return setCaptchaError(true);
        loginAction(userName, password, false, captcha);
    };

    return (
        <form className="flex flex-col space-y-2" onSubmit={handleSubmit(passwordAction)}>
            <TextField
                label="رمز عبور"
                error={errors.password}
                {...passwordRegister}
                ref={e => {
                    passwordRegister.ref(e);
                    passWordField.current = e;
                }}
                type="password"
                style={{ direction: 'ltr' }}
            />
            <span className="text-sm font-medium text-[#678093] leading-8">
                رمز عبوری را که از قبل، برای خود انتخاب کردید، وارد کنید.
            </span>
            {wrongPassword && <Captcha error={captchaError} captchaEntered={setCaptcha} />}
            <Button block type="submit" loading={loginLoading}>
                ورود
            </Button>
        </form>
    );
};

export default Password;
