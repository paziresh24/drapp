import { useMutation, useQuery } from 'react-query';
import { login } from '@paziresh24/apis/drApp/auth/login';
import { register } from '@paziresh24/apis/drApp/auth/register';
import { createCenter } from '@paziresh24/apis/drApp/auth/createCenter';
import { resendCode } from '@paziresh24/apis/drApp/auth/resendCode';
import { logout } from '@paziresh24/apis/drApp/auth/logout';
import { enablePassword } from '@paziresh24/apis/drApp/auth/enablePassword';
import { changePassword } from '@paziresh24/apis/drApp/auth/changePassword';
import { disablePassword } from '@paziresh24/apis/drApp/auth/disableStaticPassword';
import { captcha } from '@paziresh24/apis/drApp/auth/captcha';

const useResendCode = param => {
    return useQuery(['resendCode', param], () => resendCode(param), {
        enabled: false
    });
};

const useRegister = () => {
    return useMutation(register);
};

const useCreateCenter = () => {
    return useMutation(createCenter);
};

const useLogin = () => {
    return useMutation(login);
};

const useLogout = () => {
    return useMutation(logout);
};

const useEnablePassword = () => {
    return useMutation(enablePassword);
};

const useChangePassword = () => {
    return useMutation(changePassword);
};

const useDisablePassword = () => {
    return useMutation(disablePassword);
};

const useCaptcha = () => {
    return useQuery('getCaptcha', captcha, {
        enabled: false
    });
};

export {
    useRegister,
    useCreateCenter,
    useResendCode,
    useLogin,
    useLogout,
    useEnablePassword,
    useChangePassword,
    useDisablePassword,
    useCaptcha
};
