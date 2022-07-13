import TextField from '@paziresh24/shared/ui/textField/index';
import Button from '@paziresh24/shared/ui/button/index';
import styles from './password.module.scss';
import {
    useEnablePassword,
    useChangePassword,
    useDisablePassword
} from '@paziresh24/hooks/drapp/auth';
import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDrApp } from '@paziresh24/context/drapp';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import Modal from '@paziresh24/shared/ui/modal';
import { toast } from 'react-toastify';
import { useGetInfo } from '@paziresh24/hooks/drapp/home';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { Overlay } from '@paziresh24/shared/ui/overlay';

const Password = () => {
    const [info] = useDrApp();
    const [password, setPassword] = useState();
    const getinfo = useGetInfo();
    const [oldPasswordModal, setOldPasswordModal] = useState(false);
    const enablePassword = useEnablePassword();
    const changePassword = useChangePassword();
    const [enabledPassword, setEnabledPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const {
        register: registerOldPassword,
        handleSubmit: handleSubmitOldPassword,
        formState: { errors: errorsOldPassword }
    } = useForm();
    const disablePassword = useDisablePassword();

    const oldPasswordFieldRegister = registerOldPassword('oldPassWord', {
        required: true
    });

    const oldPasswordField = useRef();

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
                        old_password: info.doctor.cell.substr(6, 11),
                        password: password,
                        password_confirmation: verifyPassword
                    },
                    {
                        onSuccess: () => {
                            toast.success('رمزعبور ثابت شما فعال شد.');
                        }
                    }
                );
            },
            onError: error => {
                if (error.response.status === 400) {
                    changePassword.mutate(
                        {
                            old_password: info.doctor.cell.substr(6, 11),
                            password: password,
                            password_confirmation: verifyPassword
                        },
                        {
                            onSuccess: () => {
                                toast.success('رمزعبور ثابت شما فعال شد.');
                            },
                            onError: error => {
                                if (error.response.status === 400) {
                                    setPassword(password);
                                    setOldPasswordModal(true);
                                    oldPasswordField.current.focus();
                                }
                            }
                        }
                    );
                }
            }
        });
    };

    const savePasswordWithOldPassword = ({ oldPassWord }) => {
        changePassword.mutate(
            {
                old_password: oldPassWord,
                password: password,
                password_confirmation: password
            },
            {
                onSuccess: () => {
                    toast.success('رمزعبور شما با موفقیت تغییر کرد.');
                    setOldPasswordModal(false);
                },
                onError: error => {
                    toast.error(error.response.data.message);
                    changePassword.reset();
                }
            }
        );
    };

    useEffect(() => {
        getinfo.remove();
        getinfo.refetch();
    }, []);

    useEffect(() => {
        if (getinfo.isSuccess) setEnabledPassword(getinfo.data.data.is_static_password_enabled);
    }, [getinfo.status]);

    const togglePassword = () => {
        if (enabledPassword) {
            disablePassword.mutate();
        }
        setEnabledPassword(prev => !prev);
    };

    return (
        <>
            {getinfo.isLoading && <Overlay />}
            <>
                <div className="flex items-center space-s-3">
                    <div className={styles.toggle}>
                        <input
                            type="checkbox"
                            id="switch"
                            checked={enabledPassword}
                            onChange={togglePassword}
                        />
                        <label htmlFor="switch">Toggle</label>
                    </div>
                    <span>فعالسازی رمزعبور</span>
                </div>
                <form onSubmit={handleSubmit(savePassword)}>
                    <div className={styles.row}>
                        <TextField
                            disabled={!enabledPassword}
                            label="رمزعبور"
                            error={errors.password}
                            type="password"
                            {...register('password', { required: true })}
                        />
                        <TextField
                            disabled={!enabledPassword}
                            label="تکرار رمزعبور"
                            error={errors.verifyPassword}
                            type="password"
                            {...register('verifyPassword', { required: true })}
                        />
                    </div>
                    <Button
                        disabled={!enabledPassword}
                        block
                        type="submit"
                        loading={enablePassword.isLoading || changePassword.isLoading}
                    >
                        ذخیره رمزعبور
                    </Button>
                </form>
            </>

            <Modal
                title="رمز عبور قبلی خود را وارد نمایید."
                isOpen={oldPasswordModal}
                onClose={setOldPasswordModal}
            >
                <form
                    className={styles.form}
                    onSubmit={handleSubmitOldPassword(savePasswordWithOldPassword)}
                >
                    <TextField
                        label="تکرار رمزعبور"
                        error={errorsOldPassword.oldPassWord}
                        type="password"
                        {...oldPasswordFieldRegister}
                        ref={e => {
                            oldPasswordFieldRegister.ref(e);
                            oldPasswordField.current = e;
                        }}
                    />
                    <Button block type="submit" loading={changePassword.isLoading}>
                        تایید
                    </Button>
                </form>
            </Modal>
        </>
    );
};

export default Password;
