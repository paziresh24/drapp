import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useFinalizePrescription, useAddItemService } from '@paziresh24/hooks/prescription';
import Modal from '@paziresh24/shared/ui/modal/index';
import TextArea from '@paziresh24/shared/ui/textArea/index';
import Button from '@paziresh24/shared/ui/button';

const Visit = ({ isOpen, onClose, provider, prescriptionId, refetchData }) => {
    const addItem = useAddItemService();
    const finalize = useFinalizePrescription();
    const commentRef = useRef();

    const submitVisit = () => {
        if (provider === 'tamin') {
            addItem.mutate(
                {
                    prescriptionId,
                    comment: commentRef.current.value
                },
                {
                    onSuccess: () => {
                        finalize.mutate(
                            { prescriptionId },
                            {
                                onSuccess: () => {
                                    refetchData();
                                    onClose(false);
                                },
                                onError: error => {
                                    toast.warn(error.response.data.message);
                                }
                            }
                        );
                    },
                    onError: () => {
                        toast.warn('خطا در اضافه کردن ویزیت!');
                    }
                }
            );
        }
        if (provider === 'salamat') {
            finalize.mutate(
                { prescriptionId },
                {
                    onSuccess: () => {
                        refetchData();
                        onClose(false);
                    }
                }
            );
        }
    };

    return (
        <Modal title="تایید ویزیت" isOpen={isOpen} onClose={onClose}>
            {provider === 'tamin' && <TextArea label="توضیحات" ref={commentRef} />}
            <div className="flex gap-5">
                <Button
                    block
                    onClick={submitVisit}
                    loading={addItem.isLoading || finalize.isLoading}
                >
                    ویزیت
                </Button>
                <Button block variant="secondary" onClick={() => onClose(false)}>
                    انصراف
                </Button>
            </div>
        </Modal>
    );
};

export default Visit;
