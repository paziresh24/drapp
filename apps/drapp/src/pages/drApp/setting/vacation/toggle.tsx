import { Alert, Stack, Typography } from '@mui/material';
import { useDrApp } from '@paziresh24/context/drapp';
import Button from '@mui/lab/LoadingButton';
import Modal from '@paziresh24/shared/ui/modal';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styles from '@components/profile/password/password.module.scss';
import classNames from 'classnames';
import { LoadingIcon } from '@paziresh24/shared/icon';
import { useChangeBookingStatus } from 'apps/drapp/src/apis/booking/changeBookingStatus';
import { useBookingStatus } from 'apps/drapp/src/apis/booking/bookingStatus';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';

export const VacationToggle = () => {
    const [info] = useDrApp();
    const [isOn, setIsOn] = useState(false);
    const [shouldShowconfilitModal, setShouldShowconfilitModal] = useState<boolean>(false);
    const changeStatus = useChangeBookingStatus();
    const getBookingStatus = useBookingStatus({
        user_center_id: info.center.user_center_id
    });

    useEffect(() => {
        if (getBookingStatus.isSuccess) {
            getSplunkInstance().sendEvent({
                group: 'vacation-toggle',
                type: 'view'
            });
            const status = !!getBookingStatus.data?.data?.data
                ?.filter((item: any) => item.service_type_id === 8)
                ?.every?.((service: any) => !!service.can_booking);
            setIsOn(status);
        }
    }, [getBookingStatus.status]);

    const enableBooking = async () => {
        try {
            getSplunkInstance().sendEvent({
                group: 'vacation-toggle',
                type: 'enabled'
            });
            setIsOn(true);
            await changeStatus.mutateAsync({
                status: true,
                user_center_id: info.center.user_center_id
            });
            toast.success('نوبت دهی ویزیت آنلاین شما در ساعت کاری تعریف شده توسط شما فعال شد.');
        } catch (error) {
            setIsOn(prev => !prev);

            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        }
    };

    const disableBooking = async () => {
        getSplunkInstance().sendEvent({
            group: 'vacation-toggle',
            type: 'disabled'
        });
        try {
            setIsOn(false);
            await changeStatus.mutateAsync({
                status: false,
                user_center_id: info.center.user_center_id
            });
            toast.info(
                'پاسخ‌دهی به‌موقع برای برآورده کردن انتظارات بیماران بسیار مهم است لذا تنها در زمانی که قادر به پاسخگویی به بیماران در راس زمان نوبت‌ بیمار هستید وضعیت ویزیت آنلاین خود را فعال کنید.'
            );
            setShouldShowconfilitModal(false);
        } catch (error) {
            setIsOn(prev => !prev);

            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            }
        }
    };

    const onChange = async (status: boolean) => {
        if (status) {
            enableBooking();
            return;
        }
        setShouldShowconfilitModal(true);
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
                        disabled={changeStatus.isLoading}
                        type="checkbox"
                        id="switch"
                        checked={isOn}
                        onChange={e => onChange(e.currentTarget.checked)}
                    />
                    <label htmlFor="switch">Toggle</label>
                </div>
                {changeStatus.isLoading && <LoadingIcon color="#000" />}
            </div>

            <Modal title="" isOpen={shouldShowconfilitModal} onClose={setShouldShowconfilitModal}>
                <span>
                    در صورتی که برای شما نوبت ثبت شده باشد، با غیرفعال‌سازی ویزیت‌آنلاین این نوبت‌ها
                    حذف می‌شوند.
                </span>
                <span className="font-medium">آیا از غیرفعال‌سازی ویزیت آنلاین مطمئن هستید؟</span>
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
                        loading={changeStatus.isLoading}
                        onClick={disableBooking}
                    >
                        غیرفعال سازی
                    </Button>
                </Stack>
            </Modal>
        </>
    );
};
