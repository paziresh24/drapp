import TextField from '@paziresh24/shared/ui/textField';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useForm } from 'react-hook-form';
import { useDoctorInfoUpdate, useUploadPorfile } from '@paziresh24/hooks/drapp/profile';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { toast } from 'react-toastify';
import { useRef } from 'react';
import { useDrApp } from '@paziresh24/context/drapp';
import ChangePhoneNumber from 'apps/drapp/src/components/profile/changePhoneNumber/changePhoneNumber';
import OFFICE_CENTER from '@paziresh24/constants/officeCenter';
import Button from '@paziresh24/shared/ui/button';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import classNames from 'classnames';
import { ImagePlaceIcon } from '@paziresh24/shared/icon';
import { formData } from '@paziresh24/shared/utils';
import { baseURL } from '@paziresh24/utils/baseUrl';
import NoImage from '@assets/image/noimage.png';
import { Overlay } from '@paziresh24/shared/ui/overlay';
import { useFeatureValue } from '@growthbook/growthbook-react';
import { useUpdateProvider } from 'apps/drapp/src/apis/provider/patchProvider';
import { useGetProvider } from 'apps/drapp/src/apis/provider/getProvider';
import { useGetUser } from 'apps/drapp/src/apis/user/getUser';
import { useUpdateUser } from 'apps/drapp/src/apis/user/patchUser';

export const Info = ({ avatar = true }) => {
    const [info, setInfo] = useDrApp();
    const doctorInfoUpdate = useDoctorInfoUpdate();
    const updateProvider = useUpdateProvider();
    const updateUser = useUpdateUser();
    const { search } = useLocation();
    const urlParams = queryString.parse(search);
    const uploadPorfile = useUploadPorfile();
    const providersApiDoctorList = useFeatureValue('profile:patch-providers-api|doctor-list', {
        ids: ['']
    });
    const usersApiDoctorList = useFeatureValue('profile:patch-users-api|doctor-list', {
        ids: ['']
    });
    const providersApiDoctorCitiesList = useFeatureValue('profile:patch-providers-api|cities', {
        cities: ['']
    });
    const usersApiDoctorCitiesList = useFeatureValue('profile:patch-users-api|cities', {
        cities: ['']
    });

    const shouldUseProvider =
        providersApiDoctorList.ids?.includes(info.user.id) ||
        providersApiDoctorList.ids?.includes('*') ||
        providersApiDoctorCitiesList.cities?.includes(
            info.centers.find(center => center.type_id === OFFICE_CENTER)?.city
        ) ||
        providersApiDoctorCitiesList.cities?.includes('*');

    const shouldUseUser =
        usersApiDoctorList.ids?.includes(info.user.id) ||
        usersApiDoctorList.ids?.includes('*') ||
        usersApiDoctorCitiesList.cities?.includes(
            info.centers.find(center => center.type_id === OFFICE_CENTER)?.city
        ) ||
        usersApiDoctorCitiesList.cities?.includes('*');

    const {
        register: updateDoctorInfo,
        handleSubmit: doctorInfoSubmit,
        formState: { errors: doctorInfoErrors }
    } = useForm();
    const biographyRef = useRef();

    const updateDoctor = async data => {
        const biography = biographyRef?.current ?? info.doctor?.biography ?? '';

        try {
            await updateProvider.mutateAsync({
                biography,
                ...(data.medical_code && { employee_id: data.medical_code }),
                user_id: info.user.id
            });

            await updateUser.mutateAsync({
                name: data.name,
                family: data.family,
                ...(data.national_code && { national_code: data.national_code }),
                user_id: info.user.id
            });

            toast.success('اطلاعات شما با موفقیت ویرایش شد.');

            setInfo(prev => ({
                ...prev,
                doctor: {
                    ...prev.doctor,
                    name: data.name,
                    family: data.family,
                    national_code: data.national_code,
                    medical_code: data.medical_code,
                    biography: biography
                }
            }));
        } catch (error) {
            toast.error(error.response?.data?.error ?? error.response.data.message);
        }
    };

    return (
        <div className="flex flex-col items-center h-full gap-5 p-4 bg-white">
            {avatar && (
                <div className="relative w-24 h-24 rounded-full">
                    {!uploadPorfile.isLoading ? (
                        <>
                            <div className="relative">
                                <input
                                    type="file"
                                    id="selectImage"
                                    accept="image/png, image/jpg, image/jpeg, image/bmp"
                                    className="absolute invisible hidden"
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
                                    <ImagePlaceIcon className="absolute top-0 z-10 p-1 bg-white rounded-full cursor-pointer w-7 h-7" />
                                </label>
                            </div>
                            <img
                                className="relative object-cover w-24 h-24 rounded-full bg-slate-100"
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
            )}
            <form
                className="flex flex-col w-full h-full space-y-4"
                onSubmit={doctorInfoSubmit(updateDoctor)}
            >
                <TextField
                    label="نام"
                    error={doctorInfoErrors.name}
                    defaultValue={info.doctor.name}
                    {...updateDoctorInfo('name', { required: false })}
                    readOnly
                />
                <TextField
                    label="نام خانوادگی"
                    error={doctorInfoErrors.family}
                    defaultValue={info.doctor.family}
                    {...updateDoctorInfo('family', { required: false })}
                    readOnly
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
                <ChangePhoneNumber />

                {info.center.type_id === OFFICE_CENTER && urlParams.secretary_phone !== 'off' && (
                    <div className="hidden">
                        <TextField
                            label="شماره موبایل منشی"
                            type="tel"
                            error={doctorInfoErrors.secretary_phone}
                            defaultValue={info.doctor.secretary_phone}
                            {...updateDoctorInfo('secretary_phone', { required: false })}
                        />
                    </div>
                )}
                {urlParams.biography !== 'off' && (
                    <div className="flex flex-col space-y-3">
                        <span>بیوگرافی و توضیحات</span>
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
                )}
                <div
                    className={classNames('w-full', {
                        'fixed bottom-0 right-0 p-4 bg-white border-t border-solid border-slate-100':
                            urlParams.sticky
                    })}
                >
                    <Button
                        variant="primary"
                        block
                        type="submit"
                        loading={
                            doctorInfoUpdate.isLoading ||
                            updateProvider.isLoading ||
                            updateUser.isLoading
                        }
                    >
                        ذخیره تغییرات
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Info;
