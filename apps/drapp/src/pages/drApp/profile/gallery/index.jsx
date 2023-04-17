import { useDrApp } from '@paziresh24/context/drapp';
import { useDeleteGallery, useGetGallery, useUploadGallery } from '@paziresh24/hooks/drapp/profile';
import { UploadField } from '@paziresh24/shared/ui/upload';
import { formData } from '@paziresh24/shared/utils';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export const Gallery = () => {
    const [info, setInfo] = useDrApp();

    const getGallery = useGetGallery({ center_id: info.center.id });
    const uploadGallery = useUploadGallery();
    const deleteGallery = useDeleteGallery();

    useEffect(() => {
        getGallery.refetch();
    }, []);

    return (
        <div className="p-4">
            {getGallery.isSuccess && (
                <UploadField
                    title="عکس مطب"
                    data={getGallery.data?.data}
                    loading={
                        uploadGallery.isLoading || getGallery.isLoading || deleteGallery.isLoading
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
        </div>
    );
};

export default Gallery;
