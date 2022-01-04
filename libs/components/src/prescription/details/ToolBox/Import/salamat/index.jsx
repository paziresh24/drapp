import Modal from '@paziresh24/components/core/modal';
import Button from '@paziresh24/components/core/button';
import { useForm } from 'react-hook-form';
import {
    useImportRequestsSalamat,
    useImportStatus,
    useImportCaptchaSalamat,
    useImportOtpSalamat
} from '@paziresh24/hooks/prescription';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { toast } from 'react-toastify';
import styles from '../Import.module.scss';
import queryString from 'query-string';
import TextField from '../../../../../core/textField';
import { useEffect, useState } from 'react';
import { Overlay } from '@paziresh24/components/core/overlay';
import { toEnglishNumber } from '@paziresh24/utils';

const SalamatImport = ({ isOpen, onClose, provider }) => {
    const [prescriptionInfo] = useSelectPrescription();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const {
        register: otpRegister,
        handleSubmit: otpHandleSubmit,
        formState: { errors: otpError }
    } = useForm();

    const [otpConfirm, setOtpConfirm] = useState(false);

    const importRequests = useImportRequestsSalamat();
    const importCaptcha = useImportCaptchaSalamat();
    const importStatus = useImportStatus({
        provider: prescriptionInfo?.insuranceType ?? provider,
        _sort: 'created_at:DESC'
    });
    const importOtpSalamat = useImportOtpSalamat();
    const [captcha, setCaptcha] = useState('');

    useEffect(() => {
        if (isOpen) {
            importRequests.mutate({
                identifier: queryString.parse(window.location.search).identifier,
                provider: prescriptionInfo?.insuranceType ?? provider
            });
        }
    }, [isOpen]);

    const importRequestAction = data => {
        importCaptcha.mutate(
            {
                import_status_id: importRequests.data.importStatusId,
                captcha: toEnglishNumber(captcha)
            },
            {
                onSuccess: data => {
                    toast.success(data.message);
                    if (data.is_otp) {
                        setOtpConfirm(true);
                    } else {
                        onClose(false);
                        importStatus.remove();
                        setTimeout(() => importStatus.refetch(), 0);
                    }
                },

                onError: err => {
                    toast.error(err.response.data.message);
                }
            }
        );
    };

    const otpConfirmAction = data => {
        importOtpSalamat.mutate(
            {
                import_status_id: importRequests.data.importStatusId,
                otp: toEnglishNumber(data.otpCode)
            },
            {
                onSuccess: data => {
                    toast.success(data.message);
                    onClose(false);
                    importStatus.remove();
                    setTimeout(() => importStatus.refetch(), 0);
                },

                onError: err => {
                    toast.error(err.response.data.message);
                }
            }
        );
    };

    return (
        <>
            <Modal title="انتقال پراستفاده های من" isOpen={isOpen} onClose={onClose}>
                {importRequests.isLoading && <Overlay />}
                <form onSubmit={handleSubmit(importRequestAction)} className={styles['wrapper']}>
                    <span className={styles.description}>
                        کدامنیتی زیر را برای انتقال پراستفاده های خود وارد نمایید.
                    </span>
                    <img
                        className={styles.captcha}
                        src={`data:image/png;base64,${
                            importRequests.isSuccess && importRequests.data.captchaImage
                        }`}
                        alt=""
                    />
                    <TextField
                        typ="tel"
                        label="کدامنیتی"
                        onChange={e => setCaptcha(e.target.value)}
                        style={{ direction: 'ltr' }}
                    />
                    <Button type="submit" variant="primary" block loading={importCaptcha.isLoading}>
                        تایید
                    </Button>
                </form>
            </Modal>
            <Modal
                isOpen={otpConfirm}
                onClose={setOtpConfirm}
                title="کد تایید ارسال شده را وارد نمایید."
            >
                <form className={styles['wrapper']} onSubmit={otpHandleSubmit(otpConfirmAction)}>
                    <TextField
                        label="کد تایید"
                        error={otpError.otpCode}
                        {...otpRegister('otpCode', { required: true })}
                        style={{ direction: 'ltr' }}
                        type="tel"
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        block
                        loading={importOtpSalamat.isLoading}
                    >
                        تایید
                    </Button>
                </form>
            </Modal>
        </>
    );
};

export default SalamatImport;
