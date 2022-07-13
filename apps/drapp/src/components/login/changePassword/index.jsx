import TextField from '@paziresh24/shared/ui/textField/index';
import Button from '@paziresh24/shared/ui/button/index';
import styles from './password.module.scss';
import { useEnablePassword, useChangePassword } from '@paziresh24/hooks/drapp/auth';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

const ChangePassword = ({ userName }) => {
    const history = useHistory();
    const enablePassword = useEnablePassword();
    const changePassword = useChangePassword();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const savePassword = ({ password, verifyPassword }) => {
        if (password !== verifyPassword) {
            return toast.warn('رمزعبور و تکرار رمز عبور باید یکسان باشد.');
        }
        if (password.length < 4) {
            return toast.warn('رمزعبور باید بیشتر از 4 کاراکتر باشد.');
        }

        enablePassword.mutate(null, {
            onSuccess: () => {
                changePassword.mutate(
                    {
                        old_password: userName.substr(7, 11),
                        password: password,
                        password_confirmation: verifyPassword
                    },
                    {
                        onSuccess: () => {
                            toast.success('رمزعبور ثابت تغییر کرد.');
                            return history.replace({
                                pathname: '/',
                                state: {
                                    afterLogin: true
                                }
                            });
                        }
                    }
                );
            },
            onError: error => {
                if (error.response.status === 400) {
                    changePassword.mutate(
                        {
                            old_password: userName.substr(7, 11),
                            password: password,
                            password_confirmation: verifyPassword
                        },
                        {
                            onSuccess: () => {
                                toast.success('رمزعبور ثابت تغییر کرد.');
                                return history.replace({
                                    pathname: '/',
                                    state: {
                                        afterLogin: true
                                    }
                                });
                            },
                            onError: error => {
                                toast.error(error.response.data.message);
                            }
                        }
                    );
                }
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(savePassword)}>
            <div className={styles.row}>
                <TextField
                    label="رمزعبور جدید"
                    error={errors.password}
                    type="password"
                    {...register('password', { required: true })}
                />
                <TextField
                    label="تکرار رمزعبور جدید"
                    error={errors.verifyPassword}
                    type="password"
                    {...register('verifyPassword', { required: true })}
                />
            </div>
            <Button
                block
                type="submit"
                loading={enablePassword.isLoading || changePassword.isLoading}
            >
                ورود
            </Button>
        </form>
    );
};

export default ChangePassword;
