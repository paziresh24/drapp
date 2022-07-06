import { useDrApp } from '@paziresh24/context/drapp';
import { useDeleteTurns, useMoveTurns } from '@paziresh24/hooks/drapp/turning';
import moment from 'jalali-moment';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { getWorkHours } from '@paziresh24/apis/drApp/fillInfo/getWorkHours';
import sortBy from 'lodash/sortBy';
import getCurrentDate from 'apps/drapp/src/functions/getCurrentDate';

export const useDelay = () => {
    const router = useHistory();
    const [{ center }] = useDrApp();
    const moveTurns = useMoveTurns();
    const deleteTurns = useDeleteTurns();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => handleLoading, [moveTurns.status, deleteTurns.status]);

    const mutate = async ({ value, type }: DelayType) => {
        const now = (await getCurrentDate()).getTime() / 1000;
        const endOfDay = moment().endOf('day').unix();

        try {
            if (type === 'days') {
                const data = await deleteTurns.mutateAsync({
                    centerId: center.id,
                    data: {
                        from: now,
                        to: endOfDay
                    }
                });
                if ((data.status as any) === 'NO_RECORD') {
                    return toast.warn('نوبتی در شیفت فعلی وجود ندارد.');
                }

                toast.success('تاخیر شما ثبت شد و به بیماران پیام ارسال شد.');
                return;
            }

            const workHours = await getWorkHours({
                center_id: center.id
            });
            const nearestTimeShift = await getClosetShift(workHours?.data?.workhours);

            if (!nearestTimeShift) {
                return toast.error('ساعت کاری برای امروز وجود ندارد.');
            }

            const targetTime =
                now >= nearestTimeShift.from
                    ? moment(now * 1000)
                          .add(value, type)
                          .unix()
                    : moment(nearestTimeShift.from * 1000)
                          .add(value, type)
                          .unix();

            const data = await moveTurns.mutateAsync({
                centerId: center.id,
                data: {
                    book_from: now >= nearestTimeShift.from ? now : nearestTimeShift.from,
                    book_to: targetTime,
                    target_from: targetTime,
                    confirmed: true
                }
            });

            if ((data.status as any) === 'NO_RECORD') {
                return toast.warn('نوبتی در شیفت فعلی وجود ندارد.');
            }

            toast.success('تاخیر شما ثبت شد و به بیماران پیام ارسال شد.');
            router.push('/setting');
        } catch (error) {
            if (axios.isAxiosError(error)) error.response?.data?.message;
        }
    };

    const handleLoading = useMemo(() => {
        setIsLoading(moveTurns.isLoading || deleteTurns.isLoading);
    }, [moveTurns.isLoading, deleteTurns.isLoading]);

    return { mutate, isLoading };
};

const timeFormmatedToUnix = (time: string) => {
    return moment(time, 'HH:mm').unix();
};

const getClosetShift = async (workHours: any[]) => {
    const now = (await getCurrentDate()).getTime() / 1000;
    const sortedWorkHours = sortBy(
        workHours.filter((workHour: any) => workHour.day === new Date().getDay()),
        ['from']
    );

    const onShiftNow = sortedWorkHours.filter(workHour => {
        if (now >= timeFormmatedToUnix(workHour.from) && now < timeFormmatedToUnix(workHour.to))
            return true;
        return false;
    })?.[0];

    const beforeShift = sortedWorkHours.filter(workHour => {
        if (now < timeFormmatedToUnix(workHour.from)) return true;
        return false;
    })?.[0];

    if (onShiftNow) {
        return {
            from: timeFormmatedToUnix(onShiftNow.from),
            to: timeFormmatedToUnix(onShiftNow.to)
        };
    }

    if (beforeShift) {
        return {
            from: timeFormmatedToUnix(beforeShift.from),
            to: timeFormmatedToUnix(beforeShift.to)
        };
    }
};
