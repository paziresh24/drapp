import styles from 'assets/styles/pages/drApp/completeInfo.module.scss';
import TextField from '@paziresh24/components/core/textField';
import Button from '@paziresh24/components/core/button';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useDrApp } from '@paziresh24/context/drapp/index';
import FixedWrapBottom from '@paziresh24/components/core/fixedWrapBottom';
import { useDoctorInfoUpdate } from '@paziresh24/hooks/drapp/profile';
import { toast } from 'react-toastify';
import Select from '@paziresh24/components/doctorApp/Select';
import { useConsult } from '@paziresh24/context/drapp/consult';
import { CheckBox } from '@paziresh24/components/core/checkBox';
import { useState } from 'react';

const CompleteInfo = () => {
    const [info] = useDrApp();
    const doctorInfoUpdate = useDoctorInfoUpdate();
    const [consult, setConsult] = useConsult();
    const [gender, setGender] = useState();
    const {
        register: updateCenterInfo,
        handleSubmit: centerInfoSubmit,
        formState: { errors: centerInfoErrors }
    } = useForm();

    const history = useHistory();

    const updateCenter = data => {
        setConsult({
            ...consult,
            gender: gender.id
        });

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
                    history.push('/consult/fill-info/center-info');
                },
                onError: error => {
                    console.dir({ error });
                    toast.error(error.response.data.message);
                }
            }
        );
    };
    var genders = [
        { id: '1', name: 'اقا' },
        { id: '2', name: 'خانم' }
    ];
    return (
        <div className={styles['wrapper']}>
            <form className={styles['form']} onSubmit={centerInfoSubmit(updateCenter)}>
                <div className={styles['register-form']}>
                    <span className={styles['title']}>فعال سازی ویزیت آنلاین</span>
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

                        <Select
                            label="جنسیت"
                            onChange={value => {
                                if (value) {
                                    setGender(value);
                                }
                            }}
                            items={genders.map(item => ({
                                name: item.name,
                                value: item.id
                            }))}
                        />
                        <TextField
                            label="شماره نظام پزشکی"
                            type="tel"
                            error={centerInfoErrors.medical_code}
                            defaultValue={info.doctor.medical_code}
                            {...updateCenterInfo('medical_code', { required: false })}
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
