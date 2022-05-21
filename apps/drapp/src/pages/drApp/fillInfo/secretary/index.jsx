import Button from '@paziresh24/shared/ui/button';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';

import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import TextField from '@paziresh24/shared/ui/textField';
import { useDrApp } from '@paziresh24/context/drapp';
import { useDoctorInfoUpdate } from '@paziresh24/hooks/drapp/profile';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './secretary.module.scss';
import { VectorSecretary } from './vectorSecretary';

const Secretary = () => {
    const history = useHistory();
    const [info] = useDrApp();
    const doctorInfoUpdate = useDoctorInfoUpdate();

    const {
        register: updateCenterInfo,
        handleSubmit: centerInfoSubmit,
        formState: { errors: centerInfoErrors }
    } = useForm();

    useEffect(() => {
        getSplunkInstance().sendEvent({
            group: 'register',
            type: 'loading-/fill-info/secretary'
        });
    }, []);

    const updateCenter = data => {
        doctorInfoUpdate.mutate(
            {
                name: info.doctor.name,
                family: info.doctor.family,
                medical_code: info.doctor.medical_code,
                secretary_phone: data.secretary_phone
            },
            {
                onSuccess: () => {
                    getSplunkInstance().sendEvent({
                        group: 'register',
                        type: 'secretary-page/entered-num-secretary',
                        event: {
                            secretary_number: data.secretary_phone
                        }
                    });
                    toast.success('اطلاعات منشی شما ثبت شد.');
                    history.push('/');
                },
                onError: error => {
                    toast.error(error.response.data.message);
                }
            }
        );
    };

    return (
        <div className={styles['wrapper']}>
            <form className={styles['form']} onSubmit={centerInfoSubmit(updateCenter)}>
                <div className={styles['register-form']}>
                    <VectorSecretary className="!mx-auto !mb-6 w-44" />
                    <div className="flex flex-col space-y-1 mb-5">
                        <span className={styles['title']}>اطلاعات منشی مطب</span>
                        <span className={styles['sub-title']}>
                            برای مدیریت بهتر مطب و اطلاع منشی از نوبت های شما، شماره منشی خود را
                            وارد کنید.
                        </span>
                    </div>
                    <TextField
                        label="شماره موبایل منشی"
                        type="tel"
                        error={centerInfoErrors.secretary_phone || doctorInfoUpdate.isError}
                        errorText={doctorInfoUpdate.error?.response?.data?.errors?.secretary_phone}
                        defaultValue={info.doctor.secretary_phone}
                        {...updateCenterInfo('secretary_phone', { required: true })}
                    />
                    <FixedWrapBottom className="mt-4">
                        <Button type="submit" loading={doctorInfoUpdate.isLoading} block>
                            ثبت اطلاعات
                        </Button>
                    </FixedWrapBottom>
                </div>
            </form>
        </div>
    );
};

export default Secretary;
