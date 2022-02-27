import Modal from '@paziresh24/components/core/modal';
import TexFiled from '@paziresh24/components/core/textField';
import Button from '@paziresh24/components/core/button';
import { useForm } from 'react-hook-form';
import { useImportRequests, useImportStatus } from '@paziresh24/hooks/prescription';
import { useSelectPrescription } from '@paziresh24/context/prescription/selectPrescription-context';
import { toast } from 'react-toastify';
import styles from './Import.module.scss';
import { useUpdateTaminDoctor } from '@paziresh24/hooks/prescription/insurances';
import { digitsFaToEn } from '@paziresh24/utils';

const Import = ({ isOpen, onClose, provider, taminId }) => {
    const [prescriptionInfo] = useSelectPrescription();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const importRequests = useImportRequests();
    const importStatus = useImportStatus({
        provider: prescriptionInfo?.insuranceType ?? provider,
        _sort: 'created_at:DESC'
    });
    const updateTaminDoctor = useUpdateTaminDoctor();

    const importRequestAction = data => {
        (prescriptionInfo?.doctor?.tamin_doctor ?? taminId) &&
            updateTaminDoctor.mutate(
                {
                    // TODO: tamin doctor not exited in visotor api
                    id: prescriptionInfo?.doctor?.tamin_doctor ?? taminId,
                    username: digitsFaToEn(data.username),
                    password: digitsFaToEn(data.password)
                },
                {
                    onSuccess: () => {
                        return;
                    },
                    onError: error => {
                        const statusCode = error.response?.status;
                        if (statusCode === 401) {
                            toast.error('اطلاعات وارد شده نادرست می باشد.');
                        } else {
                            toast.error(error.response.data.message);
                        }
                    }
                }
            );
        importRequests.mutate(
            {
                provider: prescriptionInfo?.insuranceType ?? provider,
                username: digitsFaToEn(data.username),
                password: digitsFaToEn(data.password)
            },
            {
                onSuccess: data => {
                    toast.success(data.message);
                    importStatus.remove();
                    setTimeout(() => importStatus.refetch(), 0);
                    onClose(false);
                },

                onError: err => {
                    toast.error(err.response.data.message);
                }
            }
        );
    };

    return (
        <Modal title="انتقال پراستفاده های من" isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit(importRequestAction)} className={styles['wrapper']}>
                <span className={styles.description}>
                    نام کاربری و رمزعبور تامین اجتماعی را اگر وارد کنید، کلیه نسخه های پرتکراری و
                    علاقه مندی که در تامین اجتماعی تعریف کردید، در قسمت نسخ پراستفاده و ستاره داره
                    ها خواهید دید.
                </span>
                <TexFiled
                    label="نام کاربری"
                    error={errors.username}
                    {...register('username', {
                        required: true
                    })}
                />
                <TexFiled
                    label="رمز عبور"
                    error={errors.password}
                    {...register('password', {
                        required: true
                    })}
                />
                <Button
                    type="submit"
                    variant="primary"
                    block
                    loading={importRequests.isLoading || importStatus.isLoading}
                >
                    تایید
                </Button>
            </form>
        </Modal>
    );
};

export default Import;
