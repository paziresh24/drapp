import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useAddItemService, useFinalizePrescription } from '@paziresh24/hooks/prescription';
import Modal from '@paziresh24/shared/ui/modal';
import { useDrApp } from '@paziresh24/context/drapp/index';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import { usePaziresh } from '@paziresh24/hooks/drapp/turning';
import axios from 'axios';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import Button from '@mui/lab/LoadingButton';

interface Props {
    isOpen: boolean;
    onClose: (isClose: boolean) => void;
    provider: 'tamin' | 'salamat' | 'paziresh24';
    prescriptionId?: string;
    bookId?: string;
    refetchData: () => void;
}

const Visit = ({ isOpen, onClose, provider, prescriptionId, bookId, refetchData }: Props) => {
    const [info] = useDrApp();
    const addItem = useAddItemService();
    const finalize = useFinalizePrescription();
    const paziresh = usePaziresh();
    const commentRef = useRef<TextFieldProps>();

    const submitVisit = {
        tamin: ({ prescriptionId, bookId }: { prescriptionId?: string; bookId?: string }) => {
            getSplunkInstance().sendEvent({
                group: 'turning-list',
                type: 'visit-prescription-action'
            });
            addItem.mutate(
                {
                    baseURL: info.center.local_base_url,
                    prescriptionId,
                    comments: commentRef.current?.value
                },
                {
                    onSuccess: () => {
                        finalize.mutate(
                            { baseURL: info.center.local_base_url, prescriptionId },
                            {
                                onSuccess: async () => {
                                    try {
                                        if (bookId) {
                                            await submitPaziresh24Visit(bookId);
                                        }
                                        refetchData();
                                        onClose(false);
                                    } catch (error) {
                                        if (axios.isAxiosError(error))
                                            toast.error(error.response?.data?.message);
                                    }
                                },
                                onError: error => {
                                    if (axios.isAxiosError(error))
                                        toast.warn(error.response?.data?.message);
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
        salamat: ({ prescriptionId, bookId }: { prescriptionId?: string; bookId?: string }) => {
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
                                await submitPaziresh24Visit(bookId);
                            }
                            refetchData();
                            onClose(false);
                        } catch (error) {
                            if (axios.isAxiosError(error))
                                toast.error(error.response?.data?.message);
                        }
                    }
                }
            );
        },
        paziresh24: async ({ bookId }: { bookId?: string }) => {
            try {
                await submitPaziresh24Visit(bookId);
                refetchData();
                onClose(false);
            } catch (error) {
                if (axios.isAxiosError(error)) toast.error(error.response?.data?.message);
            }
        }
    };

    const submitPaziresh24Visit = (id?: string) => {
        return paziresh.mutateAsync({
            book_id: id,
            status: true
        });
    };

    return (
        <Modal title="تایید ویزیت" isOpen={isOpen} onClose={onClose}>
            {provider === 'tamin' && (
                <TextField label="توضیحات" multiline rows={4} inputRef={commentRef} />
            )}
            <div className="flex space-s-2">
                <Button
                    fullWidth
                    onClick={() =>
                        submitVisit[provider]({
                            prescriptionId,
                            bookId
                        })
                    }
                    loading={addItem.isLoading || finalize.isLoading || paziresh.isLoading}
                    variant="contained"
                >
                    ویزیت
                </Button>
                <Button fullWidth variant="outlined" onClick={() => onClose(false)}>
                    انصراف
                </Button>
            </div>
        </Modal>
    );
};

export default Visit;
