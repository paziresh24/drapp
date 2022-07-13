import Modal from '@paziresh24/shared/ui/modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/lab/LoadingButton';
import { useEffect, useState } from 'react';
import { useCheckOtp } from '@paziresh24/hooks/prescription';
import { toast } from 'react-toastify';
import { useDrApp } from '@paziresh24/context/drapp';
import axios from 'axios';
import { client as prescriptionClient } from '@paziresh24/apis/prescription/client';

interface Props {
    isOpen: boolean;
    onClose: (isClose: boolean) => void;
}

const OtpCodePresciprion = () => {
    const [info] = useDrApp();
    const checkOtp = useCheckOtp();
    const [otpCode, setOtpCode] = useState('');
    const [otpConfirm, setOtpConfirm] = useState(false);

    useEffect(() => {
        prescriptionClient.interceptors.response.use(
            (res: any) => {
                if (res?.message === 'کد تایید دو مرحله‌ای را ارسال کنید') {
                    setOtpConfirm(true);
                    return Promise.reject({
                        response: {
                            data: res
                        }
                    });
                }
                return res;
            },
            err => {
                if (err?.response?.data?.message === 'کد تایید دو مرحله‌ای را ارسال کنید') {
                    setOtpConfirm(true);
                }
                return Promise.reject(err);
            }
        );
    }, []);

    const otpConfirmAction = () => {
        if (!otpCode) return toast.error('لطفا کد تایید را وارد کنید.');
        checkOtp.mutate(
            {
                identifier: info.center.id,
                code: otpCode
            },
            {
                onSuccess: () => {
                    setOtpConfirm(false);
                },
                onError: err => {
                    if (axios.isAxiosError(err)) toast.error(err.response?.data?.message);
                }
            }
        );
    };

    return (
        <Modal
            isOpen={otpConfirm}
            onClose={setOtpConfirm}
            title="کد تایید ارسال شده را وارد نمایید."
        >
            <TextField label="کد تایید" onChange={e => setOtpCode(e.target.value)} />
            <Button
                variant="contained"
                fullWidth
                onClick={otpConfirmAction}
                loading={checkOtp.isLoading}
            >
                تایید
            </Button>
        </Modal>
    );
};

export default OtpCodePresciprion;
