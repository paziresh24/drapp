import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useForm } from 'react-hook-form';
import { useDoctorInfoUpdate } from '@paziresh24/hooks/drapp/profile';
import { toast } from 'react-toastify';
import { useRef } from 'react';
import { useDrApp } from '@paziresh24/context/drapp';
import Button from '@paziresh24/shared/ui/button';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import classNames from 'classnames';

export const Info = () => {
    const [info, setInfo] = useDrApp();
    const doctorInfoUpdate = useDoctorInfoUpdate();
    const { search } = useLocation();
    const urlParams = queryString.parse(search);

    const { handleSubmit: doctorInfoSubmit } = useForm();
    const biographyRef = useRef();

    const updateDoctor = async () => {
        doctorInfoUpdate.mutate(
            {
                name: info.doctor.name,
                family: info.doctor.family,
                national_code: info.doctor.national_code,
                medical_code: info.doctor.medical_code,
                secretary_phone: info.doctor.secretary_phone,
                biography: biographyRef?.current ?? info.doctor?.biography ?? '',
                center_id: info.center.id
            },
            {
                onSuccess: res => {
                    toast.success(res.message);

                    setInfo(prev => ({
                        ...prev,
                        doctor: {
                            ...prev.doctor,
                            biography: biographyRef?.current ?? info.doctor?.biography ?? ''
                        }
                    }));
                }
            }
        );
    };

    return (
        <div className="h-full p-4 bg-white">
            <form className="flex flex-col w-full h-full" onSubmit={doctorInfoSubmit(updateDoctor)}>
                <CKEditor
                    editor={ClassicEditor}
                    config={{
                        toolbar: ['heading', '|', 'bold', 'italic', 'bulletedList', 'numberedList'],
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
