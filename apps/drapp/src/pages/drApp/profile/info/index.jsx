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

export const Info = ({ avatar = true }) => {
    const [info, setInfo] = useDrApp();
    const doctorInfoUpdate = useDoctorInfoUpdate();
    const { search } = useLocation();
    const urlParams = queryString.parse(search);
    const uploadPorfile = useUploadPorfile();

    const {
        register: updateDoctorInfo,
        handleSubmit: doctorInfoSubmit,
        formState: { errors: doctorInfoErrors }
    } = useForm();
    const biographyRef = useRef();

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

    return (
        <div className="h-full p-4 flex gap-5 items-center flex-col bg-white">
            {avatar && (
                <div className="relative h-24 w-24 rounded-full">
                    {!uploadPorfile.isLoading ? (
                        <>
                            <div className="relative">
                                <input
                                    type="file"
                                    id="selectImage"
                                    accept="image/png, image/jpg, image/jpeg, image/bmp"
                                    className="absolute hidden invisible"
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
                                    <ImagePlaceIcon className="cursor-pointer absolute top-0 w-7 h-7 z-10 bg-white rounded-full p-1" />
                                </label>
                            </div>
                            <img
                                className="w-24 h-24 object-cover rounded-full relative bg-slate-100"
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
                <ChangePhoneNumber />
                {info.center.type_id === OFFICE_CENTER && urlParams.secretary_phone !== 'off' && (
                    <TextField
                        label="شماره موبایل منشی"
                        type="tel"
                        error={doctorInfoErrors.secretary_phone}
                        defaultValue={info.doctor.secretary_phone}
                        {...updateDoctorInfo('secretary_phone', { required: false })}
                    />
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
                        loading={doctorInfoUpdate.isLoading}
                    >
                        ذخیره تغییرات
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Info;
