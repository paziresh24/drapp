/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { useEffect, useState, lazy } from 'react';
import {
    ImagePlaceIcon,
    StarIcon,
    ThreeDots,
    UserIcon,
    LocationIcon,
    ChatIcon,
    SettingIcon
} from '@paziresh24/shared/icon';
import styles from '@assets/styles/pages/drApp/profile.module.scss';
import TextField from '@paziresh24/shared/ui/textField';
import Button from '@paziresh24/shared/ui/button';
import { Accordion } from '@paziresh24/shared/ui/accordion';
import { CheckBox } from '@paziresh24/shared/ui/checkBox';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UploadField } from '@paziresh24/shared/ui/upload';
import { useDrApp } from '@paziresh24/context/drapp';
import { useForm } from 'react-hook-form';
import { formData } from '@paziresh24/shared/utils/formData';
import Select from '@paziresh24/shared/ui/select';
import NoImage from '@assets/image/noimage.png';
import provincesData from '@paziresh24/constants/province.json';
import citiesData from '@paziresh24/constants/city.json';

import {
    useBankInfo,
    useDeleteGallery,
    useGetBankInfo,
    useGetCenterAccess,
    useGetGallery,
    useUpdateCenterAccess,
    useUploadGallery,
    useUploadPorfile,
    useDoctorInfoUpdate,
    useCenterInfoUpdate,
    useGetWhatsApp,
    useUpdateWhatsapp
} from '@paziresh24/hooks/drapp/profile';

import { Overlay } from '@paziresh24/shared/ui/overlay';
import { toast } from 'react-toastify';
import { AwardIcon } from '@paziresh24/shared/icon';
import { useRef } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import { ExpertisesWrapper } from '@components/profile/expertisesWrapper';
import { Suspense } from 'react';
import { baseURL } from '@paziresh24/utils/baseUrl';
import Password from '@components/profile/password';
import Map from '@paziresh24/shared/ui/map';
import Settings from '@components/profile/settings';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import OFFICE_CENTER from '@paziresh24/constants/officeCenter';
import CONSULT_CENTER_ID from '@paziresh24/constants/consultCenterId';
import { useHistory } from 'react-router-dom';
import BankNumberField from '@paziresh24/shared/ui/bankNumberField';
import ChangePhoneNumber from 'apps/drapp/src/components/profile/changePhoneNumber';
import { checkAddress } from 'apps/drapp/src/functions/checkAddress';
import Info from './info';

const Profile = () => {
    const router = useHistory();
    const [info, setInfo] = useDrApp();
    const [position, setPosition] = useState({ lat: 35.68818464807401, lng: 51.393077373504646 });
    const doctorInfoUpdate = useDoctorInfoUpdate();
    const centerInfoUpdate = useCenterInfoUpdate();

    const updateCenterAccess = useUpdateCenterAccess();
    const getCenterAccess = useGetCenterAccess({ center_id: info.center.id });
    const [centerAccess, setCenterAccess] = useState([]);

    const uploadPorfile = useUploadPorfile();
    const uploadGallery = useUploadGallery();
    const getGallery = useGetGallery({ center_id: info.center.id });
    const deleteGallery = useDeleteGallery();

    const getWhatsapp = useGetWhatsApp();
    const updateWhatsapp = useUpdateWhatsapp();

    const centerPromises = [];

    const [province, setProvince] = useState(info.center.province);
    const [city, setCity] = useState(info.center.city);

    const [expertiseAccordion, setExpertiseAccordion] = useState(false);
    const [whatsappAccordion, setWhatsappAccordion] = useState(false);
    const [centerInfoAccordion, setCenterInfoAccordion] = useState(false);
    const [userInfoAccordion, setUserInfoAccordion] = useState(true);
    const biographyRef = useRef();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [mapZoom, setMapZoom] = useState();

    useEffect(() => {
        if (info.center.type_id === OFFICE_CENTER) {
            getCenterAccess.remove();
            getGallery.refetch();
            getCenterAccess.refetch();
        }
    }, [info.center]);

    useEffect(() => {
        getSplunkInstance().sendEvent({
            group: 'register',
            type: 'loading-/profile'
        });
        if (info.center?.lat && info.center?.lon)
            setPosition({ lat: info.center?.lat, lng: info.center?.lon });
    }, []);

    useEffect(() => {
        if (province !== info.center.province) {
            setCity(null);
        }
    }, [province]);

    useEffect(() => {
        if (getCenterAccess.isSuccess) {
            setCenterAccess(getCenterAccess.data.data.map(item => item.id));
        }
    }, [getCenterAccess.status]);

    const {
        register: updateDoctorInfo,
        handleSubmit: doctorInfoSubmit,
        formState: { errors: doctorInfoErrors }
    } = useForm();

    const {
        register: updateCenterInfo,
        handleSubmit: centerInfoSubmit,
        formState: { errors: centerInfoErrors }
    } = useForm();

    const {
        register: bankInfoRegister,
        handleSubmit: bankSubmit,
        formState: { errors: bankInfoErrors }
    } = useForm();

    const {
        register: whatsappRegister,
        handleSubmit: whatsappSubmit,
        formState: { errors: whatsappErrors }
    } = useForm();

    const updateDoctor = async data => {
        doctorInfoUpdate.mutate(
            {
                name: data.name,
                family: data.family,
                national_code: data.national_code,
                medical_code: data.medical_code,
                biography: biographyRef?.current ?? info.doctor?.biography ?? '',
                secretary_phone: data.secretary_phone,
                center_id: info.center.id
            },
            {
                onSuccess: res => {
                    if (data.secretary_phone)
                        getSplunkInstance().sendEvent({
                            group: 'register',
                            type: 'loading-/profile-entered-num-secretary',
                            event: {
                                secretary_number: data.secretary_phone
                            }
                        });
                    if (!data.secretary_phone)
                        getSplunkInstance().sendEvent({
                            group: 'register',
                            type: 'loading-/profile-dont-entered-num-secretary'
                        });
                    toast.success(res.message);

                    setInfo(prev => ({
                        ...prev,
                        doctor: {
                            ...prev.doctor,
                            name: data.name,
                            family: data.family,
                            national_code: data.national_code,
                            medical_code: data.medical_code,
                            biography: biographyRef?.current ?? info.doctor?.biography ?? '',
                            secretary_phone: data.secretary_phone
                        }
                    }));
                }
            }
        );
    };

    const updateCenter = data => {
        centerPromises.push(updateCenterAccess.mutateAsync({ accessIds: centerAccess }));

        centerPromises.push(
            centerInfoUpdate.mutateAsync({
                data: {
                    ...data,
                    city: city,
                    province: province,
                    lat: position.lat,
                    lon: position.lng
                },
                // data: { ...data, lat: position.lat, lon: position.lng },
                centerId: info.center.id
            })
        );

        Promise.allSettled(centerPromises).then(res => {
            if (res[0].status === 'fulfilled' && res[1].status === 'fulfilled') {
                setCenterInfoAccordion(false);
                setInfo(prev => ({
                    ...prev,
                    center: {
                        ...prev.center,
                        address: data.address,
                        tell: data.tell,
                        city: city,
                        province: province,
                        lat: position.lat,
                        lon: position.lng
                    }
                }));
                return toast.success('اطلاعات مطب با موفقیت ذخیره شد.');
            }
            toast.error('خطا در ارسال اطلاعات.');
        });
    };

    const whatsappAction = data => {
        updateWhatsapp.mutate(data, {
            onSuccess: () => {
                setWhatsappAccordion(false);
                toast.success('شماره whatsapp business با موفقیت ذخیره شد.');
            },
            onError: err => {
                toast.error(err.response.data.message);
            }
        });
    };

    document.querySelector('body').addEventListener('click', e => {
        if (isDropdownOpen) {
            e.stopPropagation();
            setIsDropdownOpen(false);
        }
    });

    return (
        <div className={styles['wrapper']}>
            <div className={styles['header']}>
                <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://paziresh24.com/dr/${info.doctor.slug}`}
                >
                    <div className={styles['show-profile']}>
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={styles['show-profile-icon']}
                        >
                            <path
                                d="M15.58 12C15.58 13.98 13.98 15.58 12 15.58C10.02 15.58 8.42004 13.98 8.42004 12C8.42004 10.02 10.02 8.42004 12 8.42004C13.98 8.42004 15.58 10.02 15.58 12Z"
                                stroke="#fff"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.39997C18.82 5.79997 15.53 3.71997 12 3.71997C8.46997 3.71997 5.17997 5.79997 2.88997 9.39997C1.98997 10.81 1.98997 13.18 2.88997 14.59C5.17997 18.19 8.46997 20.27 12 20.27Z"
                                stroke="#fff"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span>مشاهده پروفایل</span>
                    </div>
                </a>
                <div className={styles['more-dropdown']}>
                    <ThreeDots
                        onClick={e => {
                            !isDropdownOpen && e.stopPropagation();
                            !isDropdownOpen && setIsDropdownOpen(true);
                            // setIsDropdownOpen(prevValue => !prevValue);
                        }}
                    />
                    {isDropdownOpen && (
                        <div className={styles['content']}>
                            <a
                                target="_blank"
                                rel="noreferrer"
                                href={`https://paziresh24.com/dr/${info.doctor.slug}`}
                                className={styles['item']}
                            >
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={styles['show-profile-icon']}
                                >
                                    <path
                                        d="M15.58 12C15.58 13.98 13.98 15.58 12 15.58C10.02 15.58 8.42004 13.98 8.42004 12C8.42004 10.02 10.02 8.42004 12 8.42004C13.98 8.42004 15.58 10.02 15.58 12Z"
                                        stroke="#3f3f79"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M12 20.27C15.53 20.27 18.82 18.19 21.11 14.59C22.01 13.18 22.01 10.81 21.11 9.39997C18.82 5.79997 15.53 3.71997 12 3.71997C8.46997 3.71997 5.17997 5.79997 2.88997 9.39997C1.98997 10.81 1.98997 13.18 2.88997 14.59C5.17997 18.19 8.46997 20.27 12 20.27Z"
                                        stroke="#3f3f79"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                <span>مشاهده پروفایل</span>
                            </a>
                        </div>
                    )}
                </div>
                <div className={styles['image-wrapper']}>
                    {!uploadPorfile.isLoading ? (
                        <>
                            <div className={styles['select-profile-image']}>
                                <input
                                    type="file"
                                    id="selectImage"
                                    accept="image/png, image/jpg, image/jpeg, image/bmp"
                                    onChange={e =>
                                        uploadPorfile.mutate(
                                            formData({
                                                file: e.target.files[0],
                                                center_id: info.center.id
                                            }),
                                            {
                                                onSuccess: data => {
                                                    setInfo(prev => ({
                                                        ...prev,
                                                        doctor: {
                                                            ...prev.doctor,
                                                            image: data.data.url
                                                        }
                                                    }));
                                                }
                                            }
                                        )
                                    }
                                />
                                <label htmlFor="selectImage">
                                    <ImagePlaceIcon />
                                </label>
                            </div>
                            <img
                                className={styles['doctor-avatar']}
                                src={
                                    uploadPorfile?.data?.data?.url
                                        ? baseURL('UPLOADER') + uploadPorfile?.data?.data?.url
                                        : null ?? info.doctor.image
                                        ? baseURL('UPLOADER') + info.doctor.image
                                        : null ?? NoImage
                                }
                                alt="avatar"
                            />
                        </>
                    ) : (
                        <Overlay />
                    )}
                </div>
                <div className={styles['doctor-info']}>
                    <div className={styles['doctor-name']}>
                        {`${info.doctor.name} ${info.doctor.family}`}
                    </div>
                    {!info.doctor.expertises.degree && (
                        <ScrollContainer className={styles['expertise-wrapper']}>
                            {info.doctor.expertises.map(expertise => (
                                <div
                                    key={expertise.id}
                                    className={styles['doctor-expertise']}
                                    onClick={() => {
                                        setUserInfoAccordion(false);
                                        setExpertiseAccordion(true);
                                    }}
                                    aria-hidden
                                >
                                    {expertise.alias_title
                                        ? expertise.alias_title
                                        : `${expertise.degree?.name ?? ''} ${
                                              expertise.expertise?.name ?? ''
                                          }`}
                                </div>
                            ))}
                        </ScrollContainer>
                    )}
                    {info.doctor?.rate?.rate && (
                        <div
                            className={styles['doctor-rate']}
                            onClick={() => router.push('/feedbacks')}
                        >
                            <StarIcon />
                            <span>
                                {info.doctor.rate.rate} از {info.doctor.rate.count} نظر
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <Accordion
                title="اطلاعات فردی"
                icon={<UserIcon color="#3F3F79" />}
                open={userInfoAccordion}
                setOpen={setUserInfoAccordion}
                className="!p-0"
            >
                <Info avatar={false} />
            </Accordion>
            <Accordion
                title="تخصص"
                icon={<AwardIcon color="#3F3F79" />}
                open={expertiseAccordion}
                setOpen={setExpertiseAccordion}
            >
                <ExpertisesWrapper setExpertiseAccordion={setExpertiseAccordion} />
            </Accordion>
            {info.center.type_id === OFFICE_CENTER && (
                <Accordion
                    title="اطلاعات مطب"
                    icon={<LocationIcon color="#3F3F79" />}
                    open={centerInfoAccordion}
                    setOpen={setCenterInfoAccordion}
                >
                    <form className={styles['form']} onSubmit={centerInfoSubmit(updateCenter)}>
                        <div className={styles['row']}>
                            <Select
                                label="استان"
                                onChange={value => {
                                    if (value.id) {
                                        setProvince(value.id);
                                        setPosition({
                                            lat: +provincesData.find(item => +item.id === +value.id)
                                                ?.lat,
                                            lng: +provincesData.find(item => +item.id === +value.id)
                                                ?.lon
                                        });
                                        setMapZoom(8);
                                    }
                                }}
                                defaultValue={province}
                                items={provincesData.map(item => ({
                                    name: item.name,
                                    value: item.id
                                }))}
                            ></Select>
                            <Select
                                label="شهر"
                                onChange={value => {
                                    if (value.id) {
                                        setCity(value.id);
                                        setPosition({
                                            lat: +citiesData.find(item => +item.id === +value.id)
                                                ?.lat,
                                            lng: +citiesData.find(item => +item.id === +value.id)
                                                ?.lon
                                        });
                                        setMapZoom(8);
                                    }
                                }}
                                defaultValue={city}
                                items={citiesData
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
                            onBlur={e => checkAddress(e.target.value)}
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
                        <TextField
                            label="خدمات مطب"
                            error={centerInfoErrors.services}
                            disable
                            value="ویزیت"
                            disabled
                        />
                        {getGallery.isSuccess && (
                            <UploadField
                                title="عکس مطب"
                                data={getGallery.data?.data}
                                loading={
                                    uploadGallery.isLoading ||
                                    getGallery.isLoading ||
                                    deleteGallery.isLoading
                                }
                                deleteAction={id =>
                                    deleteGallery.mutate(
                                        { id },
                                        {
                                            onSuccess: () => {
                                                getGallery.refetch();
                                            }
                                        }
                                    )
                                }
                                onChange={e =>
                                    uploadGallery.mutate(formData({ file: e.target.files[0] }), {
                                        onSuccess: () => {
                                            getGallery.refetch();
                                            toast.success('عکس با موفقیت بارگذاری شد.');
                                        },
                                        onError: err => {
                                            if (err.response.status === 422) {
                                                toast.error(
                                                    'لطفا عکسی با حجم کمتر از یک مگابایت بارگذاری نمایید.'
                                                );
                                            }
                                        }
                                    })
                                }
                            />
                        )}
                        {getCenterAccess.isSuccess && (
                            <>
                                <CheckBox
                                    title="دسترسی به مترو دارد"
                                    checked={centerAccess.includes(2)}
                                    onChange={e =>
                                        e.target.checked
                                            ? setCenterAccess(prev => [...prev, 2])
                                            : setCenterAccess(prev => [
                                                  ...prev.filter(i => i !== 2)
                                              ])
                                    }
                                />
                                <CheckBox
                                    title="آسانسور دارد"
                                    checked={centerAccess.includes(5)}
                                    onChange={e =>
                                        e.target.checked
                                            ? setCenterAccess(prev => [...prev, 5])
                                            : setCenterAccess(prev => [
                                                  ...prev.filter(i => i !== 5)
                                              ])
                                    }
                                />
                                <CheckBox
                                    title="امکان پذیرش بیماران ویلچری وجود دارد"
                                    checked={centerAccess.includes(1)}
                                    onChange={e =>
                                        e.target.checked
                                            ? setCenterAccess(prev => [...prev, 1])
                                            : setCenterAccess(prev => [
                                                  ...prev.filter(i => i !== 1)
                                              ])
                                    }
                                />
                                <CheckBox
                                    title="جای پارک دارد"
                                    checked={centerAccess.includes(3)}
                                    onChange={e =>
                                        e.target.checked
                                            ? setCenterAccess(prev => [...prev, 3])
                                            : setCenterAccess(prev => [
                                                  ...prev.filter(i => i !== 3)
                                              ])
                                    }
                                />
                            </>
                        )}
                        <div className="h-64">
                            <Map
                                lat={position.lat}
                                lng={position.lng}
                                zoom={mapZoom}
                                setZoom={setMapZoom}
                                sendPosition={pos => setPosition(pos)}
                            />
                        </div>
                        <Button
                            type="submit"
                            loading={updateCenterAccess.isLoading || centerInfoUpdate.isLoading}
                        >
                            ذخیره تغییرات
                        </Button>
                    </form>
                </Accordion>
            )}
            <Accordion
                title="رمزعبور ثابت"
                icon={
                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M18 10.75C17.59 10.75 17.25 10.41 17.25 10V8C17.25 4.85 16.36 2.75 12 2.75C7.64 2.75 6.75 4.85 6.75 8V10C6.75 10.41 6.41 10.75 6 10.75C5.59 10.75 5.25 10.41 5.25 10V8C5.25 5.1 5.95 1.25 12 1.25C18.05 1.25 18.75 5.1 18.75 8V10C18.75 10.41 18.41 10.75 18 10.75Z"
                            fill="#3F3F79"
                        />
                        <path
                            d="M12 19.25C10.21 19.25 8.75 17.79 8.75 16C8.75 14.21 10.21 12.75 12 12.75C13.79 12.75 15.25 14.21 15.25 16C15.25 17.79 13.79 19.25 12 19.25ZM12 14.25C11.04 14.25 10.25 15.04 10.25 16C10.25 16.96 11.04 17.75 12 17.75C12.96 17.75 13.75 16.96 13.75 16C13.75 15.04 12.96 14.25 12 14.25Z"
                            fill="#3F3F79"
                        />
                        <path
                            d="M17 22.75H7C2.59 22.75 1.25 21.41 1.25 17V15C1.25 10.59 2.59 9.25 7 9.25H17C21.41 9.25 22.75 10.59 22.75 15V17C22.75 21.41 21.41 22.75 17 22.75ZM7 10.75C3.42 10.75 2.75 11.43 2.75 15V17C2.75 20.57 3.42 21.25 7 21.25H17C20.58 21.25 21.25 20.57 21.25 17V15C21.25 11.43 20.58 10.75 17 10.75H7Z"
                            fill="#3F3F79"
                        />
                    </svg>
                }
            >
                <Password />
            </Accordion>
            <Accordion title="تنظیمات نسخه نویسی" icon={<SettingIcon color="#3F3F79" />}>
                <Settings />
            </Accordion>

            {info.center.id === CONSULT_CENTER_ID && (
                <Accordion
                    title="شماره whatsapp business"
                    icon={<ChatIcon color="#3F3F79" />}
                    open={whatsappAccordion}
                    setOpen={setWhatsappAccordion}
                >
                    <form className={styles['form']} onSubmit={whatsappSubmit(whatsappAction)}>
                        <div className={styles['bank_row']}>
                            <TextField
                                label="شماره whatsapp business"
                                type="tel"
                                error={whatsappErrors.whatsapp}
                                defaultValue={
                                    getWhatsapp.isSuccess && getWhatsapp.data.data.whatsapp
                                }
                                {...whatsappRegister('whatsapp', {
                                    required: true
                                })}
                            />
                        </div>
                        <Button block type="submit" loading={updateWhatsapp.isLoading}>
                            ذخیره تغییرات
                        </Button>
                    </form>
                </Accordion>
            )}
        </div>
    );
};

export default Profile;
