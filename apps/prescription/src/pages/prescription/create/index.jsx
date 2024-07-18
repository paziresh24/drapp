import queryString from 'query-string';
import isEmpty from 'lodash/lodash';

// HOOKS
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
    useAddPrescription,
    useCheckOtp,
    useGetMe,
    useGetPrescriptions
} from '@paziresh24/hooks/prescription/';
import { v4 as uuid } from 'uuid';
import { getToken, setToken } from '@paziresh24/utils/localstorage.js';
import { digitsFaToEn } from '@paziresh24/shared/utils/digitsFaToEn';

// COMPONENTS
import { toast } from 'react-toastify';
import { useBackPage } from '@paziresh24/context/core/backPage';
import { Overlay } from '@paziresh24/shared/ui/overlay';
import Modal from '@paziresh24/shared/ui/modal';
import TextField from '@paziresh24/shared/ui/textField';
import Button from '@paziresh24/shared/ui/button';
import { useForm } from 'react-hook-form';
import { useDrApp } from '@paziresh24/context/drapp';

const Create = () => {
    const [info] = useDrApp();
    const { search } = useLocation();
    const params = queryString.parse(search);
    const getMe = useGetMe();
    const addPrescription = useAddPrescription();
    // const getPrescription = useGetPrescriptions({
    //     identifier: params.book_id ?? null
    // });
    const [otpConfirm, setOtpConfirm] = useState(false);

    const history = useHistory();
    const uuidInstance = uuid();
    const [, setBackPage] = useBackPage();
    const checkOtp = useCheckOtp();

    const validParams = params.patient_nationalcode && params.patient_cell;
    useEffect(() => {
        addPrescription.reset();
        // getPrescription.remove();
        // if (params.token) {
        //     setToken(params.token);
        // }

        // if (validParams) {
        //     getPrescription.refetch();
        // }

        setBackPage(params.back_page ?? null);
    }, []);

    const {
        register: otpRegister,
        handleSubmit: otpHandleSubmit,
        formState: { errors: otpError }
    } = useForm();

    useEffect(() => {
        // if (getPrescription.isSuccess) {
        // if (isEmpty(getPrescription.data) || !params.book_id) {
        addPrescription.mutate(
            {
                patientNationalCode: params.patient_nationalcode,
                patientCell: !digitsFaToEn(params.patient_cell).startsWith('0')
                    ? `0${digitsFaToEn(params.patient_cell)}`
                    : digitsFaToEn(params.patient_cell),
                identifier: params.book_id ?? uuidInstance,
                ...(params.center_id && {
                    tags: [{ type: 'center_id', value: params.center_id }]
                })
            },
            {
                onSuccess: data => {
                    if (data?.message === 'نسخه‌ای با این شناسه قبلا ساخته شده است.') {
                        return history.replace(`/prescription/patient/${data.result?.id}`);
                    }
                    if (data?.message === 'کد تایید دو مرحله‌ای را ارسال کنید') {
                        return setOtpConfirm(true);
                    }
                    return history.replace(`/prescription/patient/${data.result?.id}`);
                },
                onError: e => {
                    if (e.response.data.message === 'کد تایید دو مرحله‌ای را ارسال کنید') {
                        return setOtpConfirm(true);
                    }
                    toast.error(e.response.data.message);
                    if (
                        e.response.data.message ===
                        'بیمار دارای بیمه تامین اجتماعی می‌باشد. برای تجویز، از قسمت بیمه‌های من احراز هویت کنید.'
                    ) {
                        history.push('/providers');
                    }
                    if (
                        e.response.data.message ===
                        'بیمار دارای بیمه سلامت می‌باشد. برای تجویز، از قسمت بیمه‌های من احراز هویت کنید.'
                    ) {
                        history.push('/providers');
                    }
                }
            }
        );
        // } else {
        //     return history.replace(`/prescription/patient/${getPrescription.data[0]?.id}`);
        // }
        // }
    }, []);

    const otpConfirmAction = data => {
        checkOtp.mutate(
            {
                baseURL: info.center.local_base_url,
                identifier: info.center.id,
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
            <Modal
                isOpen={otpConfirm}
                onClose={setOtpConfirm}
                title="کد تایید ارسال شده را وارد نمایید."
            >
                <form
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
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
            <Overlay />
        </>
    );
};

export default Create;
