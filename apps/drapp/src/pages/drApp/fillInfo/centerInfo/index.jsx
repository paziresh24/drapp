import styles from 'assets/styles/pages/drApp/completeInfo.module.scss';
import TextField from '@paziresh24/components/core/textField';
import Button from '@paziresh24/components/core/button';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useDrApp } from '@paziresh24/context/drapp/index';
import { useEffect, useState } from 'react';
import FixedWrapBottom from '@paziresh24/components/core/fixedWrapBottom';
import { useCenterInfoUpdate } from '@paziresh24/hooks/drapp/profile';
import provinceData from '@paziresh24/constants/province.json';
import cityData from '@paziresh24/constants/city.json';
import Select from '@paziresh24/components/doctorApp/Select';

const CenterInfo = () => {
    const [info] = useDrApp();
    const centerInfoUpdate = useCenterInfoUpdate();
    const [province, setProvince] = useState();
    const [city, setCity] = useState();
    const [cityList, setCityList] = useState();

    useEffect(() => {
        if (province) {
            if (+province !== +info.center.province) {
                setCity('');
                setCityList('');
            }
            setTimeout(() => setCityList(cityData.filter(city => +city.province_id === +province)));
        }
    }, [province]);

    const {
        register: updateCenterInfo,
        handleSubmit: centerInfoSubmit,
        formState: { errors: centerInfoErrors }
    } = useForm();

    const history = useHistory();

    const updateCenter = data => {
        centerInfoUpdate.mutateAsync(
            {
                centerId: info.center.id,
                data: {
                    address: data.address,
                    tell: data.tell,
                    city,
                    province
                }
            },
            {
                onSuccess: () => {
                    history.push('/fill-info/expertises');
                }
            }
        );
    };

    return (
        <div className={styles['wrapper']}>
            <form className={styles['form']} onSubmit={centerInfoSubmit(updateCenter)}>
                <div className={styles['register-form']}>
                    <span className={styles['sub-title']}>
                        برای راهنمایی بهتر بیماران آدرس دقیق و شماره تلفن مطب را وارد کنید.
                    </span>
                    <div className={styles['form-control']}>
                        <div className={styles['row']}>
                            <Select
                                label="استان"
                                searchble
                                onChange={value => {
                                    if (value) {
                                        setProvince(value.id);
                                    }
                                }}
                                defaultValue={+info.center.province}
                                items={provinceData.map(item => ({
                                    name: item.name,
                                    value: item.id
                                }))}
                            />
                            <Select
                                label="شهر"
                                searchble
                                onChange={value => {
                                    if (value) {
                                        setCity(value.id);
                                    }
                                }}
                                defaultValue={+info.center.city}
                                items={cityData
                                    .filter(city => +city.province_id === +province)
                                    .map(item => ({
                                        name: item.name,
                                        value: item.id
                                    }))}
                            />
                        </div>
                        <TextField
                            label="آدرس مطب"
                            error={centerInfoErrors.address}
                            defaultValue={info.center.address}
                            {...updateCenterInfo('address', { required: true })}
                        />
                        <TextField
                            label="شماره تلفن مطب"
                            type="tel"
                            defaultValue={info.center.tell}
                            error={centerInfoErrors.tell}
                            errorText="شماره تلفن را با فرمت درست وارد نمایید."
                            {...updateCenterInfo('tell', {
                                required: true,
                                pattern: /^\d+$/
                            })}
                        />
                    </div>
                    <FixedWrapBottom>
                        <Button type="submit" loading={centerInfoUpdate.isLoading} block>
                            مرحله بعدی
                        </Button>
                    </FixedWrapBottom>
                </div>
            </form>
        </div>
    );
};

export { CenterInfo };
