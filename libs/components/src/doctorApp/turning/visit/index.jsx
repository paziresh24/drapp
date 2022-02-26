import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useAddItemService, useFinalizePrescription } from '@paziresh24/hooks/prescription';
import Button from '../../../core/button';
import Modal from '../../../core/modal';
import TextArea from '../../../core/textArea';
import { useDrApp } from '@paziresh24/context/drapp/index';
import { getSplunkInstance } from '@paziresh24/components/core/provider';

const Visit = ({ isOpen, onClose, provider, prescriptionId, refetchData }) => {
    const [info] = useDrApp();
    const addItem = useAddItemService();
    const finalize = useFinalizePrescription();
    const commentRef = useRef();

    const submitVisit = () => {
        getSplunkInstance().sendEvent({
            group: 'turning-list',
            type: 'visit-prescription-action'
        });
        if (provider === 'tamin') {
            addItem.mutate(
                {
                    baseURL: info.center.local_base_url,
                    prescriptionId,
                    comments: commentRef.current.value
                },
                {
                    onSuccess: () => {
                        finalize.mutate(
                            { baseURL: info.center.local_base_url, prescriptionId },
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
