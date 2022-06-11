import { useEffect, useRef, useState } from 'react';
import styles from 'assets/styles/pages/drApp/completeInfo.module.scss';
import TextField from '@paziresh24/shared/ui/textField';
import Button from '@paziresh24/shared/ui/button';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useDrApp } from '@paziresh24/context/drapp/index';
import FixedWrapBottom from '@paziresh24/shared/ui/fixedWrapBottom';
import { useDoctorInfoUpdate } from '@paziresh24/hooks/drapp/profile';
import Container from '@mui/material/Container';
import { toast } from 'react-toastify';
import Select from '@paziresh24/shared/ui/select';
import { useConsult } from '@paziresh24/context/drapp/consult';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

const CompleteInfo = () => {
    const [info] = useDrApp();
    const doctorInfoUpdate = useDoctorInfoUpdate();
    const [consult, setConsult] = useConsult();
    const [gender, setGender] = useState();
    const [genderError, setGenderError] = useState();
    const genderItems = useRef([
        { value: '1', name: 'اقا' },
        { value: '2', name: 'خانم' }
    ]);
    const {
        register: updateCenterInfo,
        handleSubmit: centerInfoSubmit,
        formState: { errors: centerInfoErrors }
    } = useForm();

    const history = useHistory();

    useEffect(() => {
        getSplunkInstance().sendEvent({
            group: 'complete_info_consult',
            type: 'loading-complete_info_consult'
        });
    }, []);

    const updateCenter = data => {
        if (!gender?.id) {
            return setGenderError(true);
        }
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
                    getSplunkInstance().sendEvent({
                        group: 'complete_info_consult',
                        type: 'successful'
                    });
                    history.push('/consult/fill-info/center-info');
                },
                onError: error => {
                    getSplunkInstance().sendEvent({
                        group: 'complete_info_consult',
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
        <Container
            maxWidth="sm"
            className="h-full md:h-auto md:p-5 rounded-md pt-4 bg-white md:mt-8 md:shadow-md"
        >
            {' '}
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
                            error={genderError}
                            label="جنسیت"
                            onChange={value => {
                                if (value) {
                                    setGender(value);
                                }
                            }}
                            items={genderItems.current}
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
        </Container>
    );
};

export { CompleteInfo };
