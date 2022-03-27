import { useState, forwardRef } from 'react';
import styles from './upload.module.scss';
import { v4 } from 'uuid';
import { Overlay } from '../overlay';
import Modal from '../modal';
import Button from '../button';
import ScrollContainer from 'react-indiana-drag-scroll';
import isEmpty from 'lodash/isEmpty';
import { TrashIcon } from '@paziresh24/components/icons';

const UploadField = forwardRef(({ title, onChange, data, loading, deleteAction }, ref) => {
    const [id] = useState(v4());
    const [deleteImage, setDeleteImage] = useState();
    const [selectedImage, setSelectedImage] = useState();
    const [previewModal, setPreviewModal] = useState(false);

    return (
        <div className={styles['file']}>
            <input
                type="file"
                ref={ref}
                className={styles['file-input']}
                id={id}
                onChange={onChange}
                accept="image/*"
                multiple
            />
            {!isEmpty(data) && (
                <ScrollContainer className={styles['gallery']}>
                    {data.map(image => (
                        <img
                            className={styles['image']}
                            key={image.id}
                            src={image.url}
                            alt={image.filename}
                            onClick={() => {
                                setSelectedImage(image.id);
                                // setDeleteImage(true);
                                setPreviewModal(true);
                            }}
                            aria-hidden
                        />
                    ))}
                </ScrollContainer>
            )}

            <label className={styles['file-label']} htmlFor={id}>
                {!loading ? (
                    <>
                        <svg
                            width="23"
                            height="23"
                            viewBox="0 0 23 23"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M11.5 0C12.1904 0 12.75 0.559644 12.75 1.25V10.25H21.75C22.4404 10.25 23 10.8096 23 11.5C23 12.1904 22.4404 12.75 21.75 12.75H12.75V21.75C12.75 22.4404 12.1904 23 11.5 23C10.8096 23 10.25 22.4404 10.25 21.75V12.75H1.25C0.559644 12.75 0 12.1904 0 11.5C0 10.8096 0.559644 10.25 1.25 10.25H10.25V1.25C10.25 0.559644 10.8096 0 11.5 0Z"
                                fill="#91a5b6"
                            />
                        </svg>
                        {title}
                        <span className={styles['size']}>( حداکثر یک مگابایت )</span>
                    </>
                ) : (
                    <Overlay />
                )}
            </label>

            <Modal isOpen={previewModal} onClose={setPreviewModal}>
                {selectedImage && (
                    <img
                        src={data.find(image => image.id === selectedImage)?.url}
                        alt={data.find(image => image.id === selectedImage)?.filename}
                    />
                )}
                <Button
                    block
                    theme="error"
                    variant="secondary"
                    onClick={() => setDeleteImage(true)}
                >
                    <div className="flex items-center space-s-3">
                        <TrashIcon color="#f56262" />
                        <span className="text-[#f56262]">حذف تصویر</span>
                    </div>
                </Button>
            </Modal>

            <Modal
                title="آیا از حذف تصویر مطمئن هستید؟"
                isOpen={deleteImage}
                onClose={setDeleteImage}
            >
                <div className={styles['confirm-row']}>
                    <Button
                        block
                        theme="error"
                        loading={loading}
                        onClick={() => {
                            deleteAction(selectedImage);
                            setDeleteImage(false);
                            setPreviewModal(false);
                            setSelectedImage(null);
                        }}
                    >
                        بله و حذف
                    </Button>
                    <Button
                        block
                        theme="error"
                        variant="secondary"
                        onClick={() => setDeleteImage(false)}
                    >
                        انصراف
                    </Button>
                </div>
            </Modal>
        </div>
    );
});

export { UploadField };
