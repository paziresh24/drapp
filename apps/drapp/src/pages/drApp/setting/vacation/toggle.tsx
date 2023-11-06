import { Alert, Stack, Switch, Typography } from '@mui/material';
import { useDrApp } from '@paziresh24/context/drapp';
import Button from '@mui/lab/LoadingButton';
import {
    useDeleteTurns,
    useDeleteVacation,
    useGetVacation,
    useVacation
} from '@paziresh24/hooks/drapp/turning';
import Modal from '@paziresh24/shared/ui/modal';
import axios from 'axios';
import moment from 'jalali-moment';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styles from '@components/profile/password/password.module.scss';
import classNames from 'classnames';
import { LoadingIcon } from '@paziresh24/shared/icon';

const currentDate = moment().unix();
const endDate = 1943728199;
export const VacationToggle = () => {
    const [info] = useDrApp();
    const [isOn, setIsOn] = useState(false);
    const [shouldShowconfilitModal, setShouldShowconfilitModal] = useState<boolean>(false);
    const deleteTurnsRequest = useDeleteTurns();

    const getVacation = useGetVacation({
        center_id: info.center.id,
        filter: {
            from: currentDate,
            to: endDate
        }
    });
    const vacationRequest = useVacation();
    const deleteVacation = useDeleteVacation();

    useEffect(() => {
        if (getVacation.isSuccess) {
            setIsOn(getVacation.data?.data?.length === 0);
        }
    }, [getVacation.status]);

    const onChange = async (status: boolean) => {
        try {
            if (!status) {
                setIsOn(false);
                await vacationRequest.mutateAsync({
                    centerId: info.center.id,
                    data: {
                        from: moment().unix(),
                        to: moment().add('jDay', 90).startOf('jDay').unix()
                    }
                });

                return;
            }
            setIsOn(true);
            await deleteVacation.mutateAsync({
                center_id: info.center.id,
                from: moment().startOf('jDay').unix(),
                to: endDate
            });
        } catch (error) {
            setIsOn(prev => !prev);

            if (axios.isAxiosError(error)) {
                if (error?.response?.data?.status === 'BOOK_CONFLICT') {
                    return setShouldShowconfilitModal(true);
                }
                toast.error(error.response?.data?.message);
            }
        }
    };

    const deleteTurns = () => {
        deleteTurnsRequest.mutate(
            {
                centerId: info.center.id,
                data: {
                    from: moment().unix(),
                    to: moment().add('jDay', 90).startOf('jDay').unix()
                }
            },
            {
                onSuccess: () => {
                    toast.success('مرخصی شما ثبت شد.');
                    setIsOn(prev => !prev);
                    setShouldShowconfilitModal(false);
                },
                onError: err => {
                    if (axios.isAxiosError(err)) {
                        toast.error(err?.response?.data?.message);
                    }
                }
            }
        );
    };

    return (
        <>
            <div
                className={classNames(
                    'flex items-center transition-all justify-center w-full p-3 space-s-1',
                    {
                        'bg-red-50/30': !isOn,
                        'bg-green-100/30': isOn
                    }
                )}
            >
                <span className="text-sm font-bold">وضعیت ویزیت آنلاین</span>
                <span
                    className={classNames('text-xs  font-medium', {
                        'text-green-600': isOn,
                        'text-red-600': !isOn
                    })}
                >
                    {isOn ? '(فعال)' : '(غیرفعال)'}
                </span>
                <div className={styles.toggle}>
                    <input
                        disabled={
                            getVacation.isLoading ||
                            vacationRequest.isLoading ||
                            deleteVacation.isLoading
                        }
                        type="checkbox"
                        id="switch"
                        checked={isOn}
                        onChange={e => onChange(e.currentTarget.checked)}
                    />
                    <label htmlFor="switch">Toggle</label>
                </div>
                {(getVacation.isLoading ||
                    vacationRequest.isLoading ||
                    deleteVacation.isLoading) && <LoadingIcon color="#000" />}
            </div>

            <Modal
                title="غیرفعال‌سازی ویزیت آنلاین"
                isOpen={shouldShowconfilitModal}
                onClose={setShouldShowconfilitModal}
            >
                <span>
                    برای شما{' '}
                    {vacationRequest.isError &&
                        (vacationRequest.error as any)?.response?.data?.data
                            ?.not_paid_books_count}{' '}
                    نوبت در حال پرداخت و{' '}
                    {vacationRequest.isError &&
                        (vacationRequest.error as any)?.response?.data?.data?.paid_books_count}{' '}
                    نوبت پرداخت شده وجود دارد، با غیرفعالسازی ویزیت‌آنلاین این نوبت‌ها حذف می‌شوند.
                </span>
                <span className="font-medium">آیا از حذف نوبت های خود مطمئن هستید؟</span>
                <Alert icon={false} className="!bg-[#F3F6F9]">
                    <Typography fontSize="0.9rem" fontWeight="medium">
                        درﻧﻈﺮ داﺷﺘﻪ ﺑﺎﺷﯿﺪ ﮐﻪ ﭘﺲ از ﺣﺬف نوبت ﺑﺮای ﺑﯿﻤﺎران ﭘﯿﺎﻣﮏ ارﺳﺎل ﻣﯽ ﺷﻮد.
                    </Typography>
                </Alert>
                <Stack direction="row" spacing={2}>
                    <Button
                        color="error"
                        fullWidth
                        variant="outlined"
                        loading={deleteTurnsRequest.isLoading}
                        onClick={deleteTurns}
                    >
                        حذف نوبت
                    </Button>
                </Stack>
            </Modal>
        </>
    );
};
