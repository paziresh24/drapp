import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useAddItemService, useFinalizePrescription } from '@paziresh24/hooks/prescription';
import Button from '../../../core/button';
import Modal from '../../../core/modal';
import TextArea from '../../../core/textArea';
import { useDrApp } from '@paziresh24/context/drapp/index';
import { getSplunkInstance } from '@paziresh24/components/core/provider';
import { usePaziresh } from '@paziresh24/hooks/drapp/turning';

const Visit = ({ isOpen, onClose, provider, prescriptionId, bookId, refetchData }) => {
    const [info] = useDrApp();
    const addItem = useAddItemService();
    const finalize = useFinalizePrescription();
    const paziresh = usePaziresh();
    const commentRef = useRef();

    const submitVisit = {
        tamin: ({ prescriptionId, bookId }) => {
            getSplunkInstance().sendEvent({
                group: 'turning-list',
                type: 'visit-prescription-action'
            });
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
                                onSuccess: async () => {
                                    try {
                                        if (bookId) {
                                            await paziresh24Visit(bookId);
                                        }
                                        refetchData();
                                        onClose(false);
                                    } catch (e) {
                                        toast.error(e.response.data.message);
                                    }
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
        },
        salamat: ({ prescriptionId, bookId }) => {
            getSplunkInstance().sendEvent({
                group: 'turning-list',
                type: 'visit-prescription-action'
            });
            finalize.mutate(
                { prescriptionId },
                {
                    onSuccess: async () => {
                        try {
                            if (bookId) {
                                await paziresh24Visit(bookId);
                            }
                            refetchData();
                            onClose(false);
                        } catch (e) {
                            toast.error(e.response.data.message);
                        }
                    }
                }
            );
        },
        paziresh24: async ({ bookId }) => {
            try {
                await paziresh24Visit(bookId);
                refetchData();
                onClose(false);
            } catch (e) {
                toast.error(e.response.data.message);
            }
        }
    };

    const paziresh24Visit = id => {
        return paziresh.mutateAsync(
            {
                book_id: id,
                status: true
            },
            {}
        );
    };

    return (
        <Modal title="تایید ویزیت" isOpen={isOpen} onClose={onClose}>
            {provider === 'tamin' && <TextArea label="توضیحات" ref={commentRef} />}
            <div className="flex gap-5">
                <Button
                    block
                    onClick={() =>
                        submitVisit[provider]({
                            prescriptionId,
                            bookId
                        })
                    }
                    loading={addItem.isLoading || finalize.isLoading || paziresh.isLoading}
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
