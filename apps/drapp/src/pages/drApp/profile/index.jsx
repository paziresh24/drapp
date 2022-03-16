/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { useEffect, useState, lazy } from 'react';
import {
    ImagePlaceIcon,
    StarIcon,
    ThreeDots,
    UserIcon,
    LocationIcon,
    ChatIcon
} from '@paziresh24/components/icons';
import styles from '@assets/styles/pages/drApp/profile.module.scss';
import TextField from '@paziresh24/components/core/textField';
import Button from '@paziresh24/components/core/button';
import { Accordion } from '@paziresh24/components/core/accordion';
import { CheckBox } from '@paziresh24/components/core/checkBox';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UploadField } from '@paziresh24/components/core/upload';
import { useDrApp } from '@paziresh24/context/drapp';
import { useForm } from 'react-hook-form';
import { formData } from '@paziresh24/utils';
import Select from '@paziresh24/components/doctorApp/Select';
import NoImage from '@paziresh24/assets/images/drapp/noimage.png';
import provinceData from '@paziresh24/constants/province.json';
import cityData from '@paziresh24/constants/city.json';

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

import { Overlay } from '@paziresh24/components/core/overlay';
import { toast } from 'react-toastify';
import { AwardIcon } from '@paziresh24/components/icons';
import { useRef } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import { ExpertisesWrapper } from '@paziresh24/components/doctorApp/profile/expertisesWrapper';
import { Suspense } from 'react';
import { baseURL } from '@paziresh24/utils/baseUrl';
import Password from '@paziresh24/components/doctorApp/profile/password';
import Map from '@paziresh24/components/core/map';
import Settings from '@paziresh24/components/doctorApp/profile/settings';

const Profile = () => {
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

    const bankInfo = useBankInfo();
    const getBankInfo = useGetBankInfo({ center_id: info.center.id });

    const getWhatsapp = useGetWhatsApp();
    const updateWhatsapp = useUpdateWhatsapp();

    const centerPromises = [];

    const [province, setProvince] = useState();
    const [city, setCity] = useState();

    const [expertiseAccordion, setExpertiseAccordion] = useState(false);
    const [bankAccordion, setBankAccordion] = useState(false);
    const [whatsappAccordion, setWhatsappAccordion] = useState(false);
    const [centerInfoAccordion, setCenterInfoAccordion] = useState(false);
    const [userInfoAccordion, setUserInfoAccordion] = useState(true);
    const [serviceDesk, setServiceDesk] = useState();
    const biographyRef = useRef();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [mapZoom, setMapZoom] = useState();

    useEffect(() => {
        if (info.center.type_id === 1) {
            getCenterAccess.remove();
            getGallery.refetch();
            getCenterAccess.refetch();
        }
    }, [info.center]);

    useEffect(() => {
        setProvince(info.center.province);
        setCity(info.center.city);
        if (info.center?.lat && info.center?.lon)
            setPosition({ lat: info.center?.lat, lng: info.center?.lon });
    }, []);

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
                biography: biographyRef.current,
                service_desk: serviceDesk ? serviceDesk : '',
                secretary_phone: data.secretary_phone,
                center_id: info.center.id
            },
            {
                onSuccess: res => {
                    toast.success(res.message);
                    setUserInfoAccordion(false);

                    setInfo(prev => ({
                        ...prev,
                        doctor: {
                            ...prev.doctor,
                            name: data.name,
                            family: data.family,
                            national_code: data.national_code,
                            medical_code: data.medical_code,
                            biography: biographyRef.current,
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

    const bankAction = data => {
        bankInfo.mutate(data, {
            onSuccess: () => {
                setBankAccordion(false);
                toast.success('اطلاعات بانکی با موفقیت ذخیره شد.');
            },
            onError: err => {
                toast.error(err.response.data.errors.IBAN[0]);
            }
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
                        <div className={styles['doctor-rate']}>
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
            >
                <form className={styles['form']} onSubmit={doctorInfoSubmit(updateDoctor)}>
                    <TextField
                        label="نام"
                        error={doctorInfoErrors.name}
                        defaultValue={info.doctor.name}
                        {...updateDoctorInfo('name', { required: false })}
                    />
                    <TextField
                        label="نام خانوادگی"
                        error={doctorInfoErrors.family}
                        defaultValue={info.doctor.family}
                        {...updateDoctorInfo('family', { required: false })}
                    />
                    <TextField
                        label="کد ملی"
                        type="tel"
                        error={doctorInfoErrors.national_code}
                        defaultValue={info.doctor.national_code}
                        {...updateDoctorInfo('national_code', { required: false })}
                    />
                    <TextField
                        label="شماره نظام پزشکی"
                        type="tel"
                        error={doctorInfoErrors.medical_code}
                        defaultValue={info.doctor.medical_code}
                        {...updateDoctorInfo('medical_code', { required: false })}
                    />
                    <TextField
                        label="شماره موبایل منشی"
                        type="tel"
                        error={doctorInfoErrors.secretary_phone}
                        defaultValue={info.doctor.secretary_phone}
                        {...updateDoctorInfo('secretary_phone', { required: false })}
                    />
                    <div className={styles['col']}>
                        <span style={{ marginBottom: '1rem' }}>بیوگرافی</span>
                        <CKEditor
                            editor={ClassicEditor}
                            config={{
                                toolbar: [
                                    'heading',
                                    '|',
                                    'bold',
                                    'italic',
                                    'bulletedList',
                                    'numberedList'
                                ],
                                heading: {
                                    options: [
                                        {
                                            model: 'paragraph',
                                            title: 'Paragraph',
                                            class: 'ck-heading_paragraph'
                                        },
                                        {
                                            model: 'heading1',
                                            view: 'h1',
                                            title: 'Heading 1',
                                            class: 'ck-heading_heading1'
                                        },
                                        {
                                            model: 'heading2',
                                            view: 'h2',
                                            title: 'Heading 2',
                                            class: 'ck-heading_heading2'
                                        }
                                    ]
                                },
                                contentsLangDirection: 'rtl',
                                language: 'fa'
                            }}
                            data={info.doctor.biography}
                            onBlur={(event, editor) => {
                                const data = editor.getData();
                                biographyRef.current = data;
                            }}
                        />
                    </div>
                    {info.center.id === '5532' && (
                        <div className={styles['col']}>
                            <span style={{ marginBottom: '1rem' }}>توضیحات خدمات مشاوره</span>
                            <CKEditor
                                editor={ClassicEditor}
                                config={{
                                    toolbar: [
                                        'heading',
                                        '|',
                                        'bold',
                                        'italic',
                                        'bulletedList',
                                        'numberedList'
                                    ],
                                    heading: {
                                        options: [
                                            {
                                                model: 'paragraph',
                                                title: 'Paragraph',
                                                class: 'ck-heading_paragraph'
                                            },
                                            {
                                                model: 'heading1',
                                                view: 'h1',
                                                title: 'Heading 1',
                                                class: 'ck-heading_heading1'
                                            },
                                            {
                                                model: 'heading2',
                                                view: 'h2',
                                                title: 'Heading 2',
                                                class: 'ck-heading_heading2'
                                            }
                                        ]
                                    },
                                    contentsLangDirection: 'rtl',
                                    language: 'fa'
                                }}
                                data={info.doctor.desk ? info.doctor.desk : ''}
                                onBlur={(event, editor) => {
                                    const data = editor.getData();
                                    setServiceDesk(data);
                                }}
                            />
                        </div>
                    )}
                    <Button variant="primary" type="submit" loading={doctorInfoUpdate.isLoading}>
                        ذخیره تغییرات
                    </Button>
                </form>
            </Accordion>
            <Accordion
                title="تخصص"
                icon={<AwardIcon color="#3F3F79" />}
                open={expertiseAccordion}
                setOpen={setExpertiseAccordion}
            >
                <ExpertisesWrapper setExpertiseAccordion={setExpertiseAccordion} />
            </Accordion>
            <Accordion
                title="تنظیم رمزعبور ثابت"
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
            <Accordion
                title="تنظیم اعلان ها"
                icon={
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M12.0199 20.5299C9.68987 20.5299 7.35987 20.1599 5.14987 19.4199C4.30987 19.1299 3.66987 18.5399 3.38987 17.7699C3.09987 16.9999 3.19987 16.1499 3.65987 15.3899L4.80987 13.4799C5.04987 13.0799 5.26987 12.2799 5.26987 11.8099V8.91992C5.26987 5.19992 8.29987 2.16992 12.0199 2.16992C15.7399 2.16992 18.7699 5.19992 18.7699 8.91992V11.8099C18.7699 12.2699 18.9899 13.0799 19.2299 13.4899L20.3699 15.3899C20.7999 16.1099 20.8799 16.9799 20.5899 17.7699C20.2999 18.5599 19.6699 19.1599 18.8799 19.4199C16.6799 20.1599 14.3499 20.5299 12.0199 20.5299ZM12.0199 3.66992C9.12987 3.66992 6.76987 6.01992 6.76987 8.91992V11.8099C6.76987 12.5399 6.46987 13.6199 6.09987 14.2499L4.94987 16.1599C4.72987 16.5299 4.66987 16.9199 4.79987 17.2499C4.91987 17.5899 5.21987 17.8499 5.62987 17.9899C9.80987 19.3899 14.2399 19.3899 18.4199 17.9899C18.7799 17.8699 19.0599 17.5999 19.1899 17.2399C19.3199 16.8799 19.2899 16.4899 19.0899 16.1599L17.9399 14.2499C17.5599 13.5999 17.2699 12.5299 17.2699 11.7999V8.91992C17.2699 6.01992 14.9199 3.66992 12.0199 3.66992Z"
                            fill="#3F3F79"
                        />
                        <path
                            d="M13.8796 3.94018C13.8096 3.94018 13.7396 3.93018 13.6696 3.91018C13.3796 3.83018 13.0996 3.77018 12.8296 3.73018C11.9796 3.62018 11.1596 3.68018 10.3896 3.91018C10.1096 4.00018 9.80963 3.91018 9.61963 3.70018C9.42963 3.49018 9.36963 3.19018 9.47963 2.92018C9.88963 1.87018 10.8896 1.18018 12.0296 1.18018C13.1696 1.18018 14.1696 1.86018 14.5796 2.92018C14.6796 3.19018 14.6296 3.49018 14.4396 3.70018C14.2896 3.86018 14.0796 3.94018 13.8796 3.94018Z"
                            fill="#3F3F79"
                        />
                        <path
                            d="M12.0195 22.8101C11.0295 22.8101 10.0695 22.4101 9.36953 21.7101C8.66953 21.0101 8.26953 20.0501 8.26953 19.0601H9.76953C9.76953 19.6501 10.0095 20.2301 10.4295 20.6501C10.8495 21.0701 11.4295 21.3101 12.0195 21.3101C13.2595 21.3101 14.2695 20.3001 14.2695 19.0601H15.7695C15.7695 21.1301 14.0895 22.8101 12.0195 22.8101Z"
                            fill="#3F3F79"
                        />
                    </svg>
                }
            >
                <Settings />
            </Accordion>
            {info.center.type_id === 1 && (
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
                                searchble
                                // value={setProvince}
                                onChange={value => {
                                    if (value) {
                                        setProvince(value.id);
                                        setPosition({
                                            lat: +provinceData.find(item => +item.id === +value.id)
                                                ?.lat,
                                            lng: +provinceData.find(item => +item.id === +value.id)
                                                ?.lon
                                        });
                                        return setMapZoom(8);
                                    }
                                }}
                                defaultValue={+info.center.province}
                                items={provinceData.map(item => ({
                                    name: item.name,
                                    value: item.id
                                }))}
                            >
                                {/* {provinceData.map(province => (
                                    <Option
                                        key={province.id}
                                        title={province.name}
                                        value={+province.id}
                                    >
                                        {province.name}
                                    </Option>
                                ))} */}
                            </Select>
                            <Select
                                label="شهر"
                                searchble
                                onChange={value => {
                                    if (value) {
                                        setCity(value.id);
                                        setPosition({
                                            lat: +cityData.find(item => +item.id === +value.id)
                                                ?.lat,
                                            lng: +cityData.find(item => +item.id === +value.id)?.lon
                                        });
                                        return setMapZoom(8);
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
                            {...updateCenterInfo('tell', { required: true })}
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
                                            onError: err => {
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
                        <Suspense fallback={<Overlay />}>
                            <Map
                                lat={position.lat}
                                lng={position.lng}
                                zoom={mapZoom}
                                setZoom={setMapZoom}
                                sendPosition={pos => setPosition(pos)}
                            />
                        </Suspense>
                        <Button
                            type="submit"
                            loading={updateCenterAccess.isLoading || centerInfoUpdate.isLoading}
                        >
                            ذخیره تغییرات
                        </Button>
                    </form>
                </Accordion>
            )}
            {(info.center.type_id === 1 || info.center.id === '5532') && (
                <Accordion
                    title="اطلاعات بانکی"
                    icon={<UserIcon color="#3F3F79" />}
                    open={bankAccordion}
                    setOpen={setBankAccordion}
                >
                    <form className={styles['form']} onSubmit={bankSubmit(bankAction)}>
                        <div className={styles['bank_row']}>
                            <TextField
                                label="شماره شبا"
                                type="tel"
                                error={bankInfoErrors.IBAN}
                                defaultValue={getBankInfo.isSuccess && getBankInfo.data.data}
                                {...bankInfoRegister('IBAN', {
                                    required: true,
                                    maxLength: 24,
                                    minLength: 24
                                })}
                            />
                            <span>IR</span>
                        </div>
                        <Button block type="submit" loading={bankInfo.isLoading}>
                            ذخیره تغییرات
                        </Button>
                    </form>
                </Accordion>
            )}
            {info.center.id === '5532' && (
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
