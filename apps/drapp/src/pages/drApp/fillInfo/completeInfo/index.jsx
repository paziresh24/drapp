import styles from 'assets/styles/pages/drApp/completeInfo.module.scss';
import TextField from '@paziresh24/components/core/textField';
import Button from '@paziresh24/components/core/button';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useDrApp } from '@paziresh24/context/drapp/index';
import FixedWrapBottom from '@paziresh24/components/core/fixedWrapBottom';
import { useDoctorInfoUpdate } from '@paziresh24/hooks/drapp/profile';
import { toast } from 'react-toastify';
import { getSplunkInstance } from '@paziresh24/components/core/provider';

const CompleteInfo = () => {
    const [info] = useDrApp();
    const doctorInfoUpdate = useDoctorInfoUpdate();

    const {
        register: updateCenterInfo,
        handleSubmit: centerInfoSubmit,
        formState: { errors: centerInfoErrors }
    } = useForm();

    const history = useHistory();

    const updateCenter = data => {
        doctorInfoUpdate.mutate(
            {
                name: info.doctor.name,
                family: info.doctor.family,
                national_code: info.doctor.national_code,
                medical_code: info.doctor.medical_code,
                secretary_phone: data.secretary_phone
            },
            {
                onSuccess: () => {
                    getSplunkInstance().sendEvent({
                        group: 'complete_info_active_booking',
                        type: 'successful'
                    });
                    history.push('/fill-info/center-info');
                },
                onError: error => {
                    getSplunkInstance().sendEvent({
                        group: 'complete_info_active_booking',
                        type: 'unsuccessful',
                        event: {
                            error: error.response?.data
                        }
                    });
                    console.dir({ error });
                    toast.error(error.response.data.message);
                }
            }
        );
    };

    return (
        <div className={styles['wrapper']}>
            <form className={styles['form']} onSubmit={centerInfoSubmit(updateCenter)}>
                <div className={styles['register-form']}>
                    <span className={styles['title']}>راه اندازی نوبت دهی مطب</span>
                    <span className={styles['sub-title']}>
                        با استفاده از کدنظام پزشکی شما، اطلاعات فردی تان را کامل کردیم.
                    </span>
                    <div className={styles['form-control']}>
                        <TextField
                            label="نام"
                            error={centerInfoErrors.name}
                            defaultValue={info.doctor.name}
                            {...updateCenterInfo('name', { required: false })}
                        />
                        <TextField
                            label="نام خانوادگی"
                            error={centerInfoErrors.family}
                            defaultValue={info.doctor.family}
                            {...updateCenterInfo('family', { required: false })}
                        />
                        <TextField
                            label="کد ملی"
                            type="tel"
                            error={centerInfoErrors.national_code}
                            defaultValue={info.doctor.national_code}
                            {...updateCenterInfo('national_code', { required: false })}
                        />
                        <TextField
                            label="شماره نظام پزشکی"
                            type="tel"
                            error={centerInfoErrors.medical_code}
                            defaultValue={info.doctor.medical_code}
                            {...updateCenterInfo('medical_code', { required: false })}
                        />
                        <span className={styles['sub-title']}>
                            اگر نیاز به ارسال پیام برای منشی هم هست، شماره ایشان را وارد کنید.
                        </span>
                        <TextField
                            label="شماره موبایل منشی"
                            type="tel"
                            error={centerInfoErrors.secretary_phone}
                            defaultValue={info.doctor.secretary_phone}
                            {...updateCenterInfo('secretary_phone', { required: false })}
                        />
                    </div>
                    <FixedWrapBottom>
                        <Button type="submit" loading={doctorInfoUpdate.isLoading} block>
                            مرحله بعدی
                        </Button>
                    </FixedWrapBottom>
                </div>
            </form>
        </div>
    );
};

export { CompleteInfo };
