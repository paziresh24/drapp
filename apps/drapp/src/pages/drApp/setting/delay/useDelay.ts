import { useState } from 'react';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import moment from 'jalali-moment';
import axios from 'axios';
import sortBy from 'lodash/sortBy';

import { useDrApp } from '@paziresh24/context/drapp';
import { useDeleteTurns, useMoveTurns } from '@paziresh24/hooks/drapp/turning';
import { getWorkHours } from '@paziresh24/apis/drApp/fillInfo/getWorkHours';
import getCurrentDate from '../../../../functions/getCurrentDate';

type WorkHours = {
    from: string;
    to: string;
    day: number;
};

const timeFormmatedToUnix = (time: string) => {
    return moment(time, 'HH:mm').unix();
};

export const useDelay = () => {
    const router = useHistory();
    const [{ center }] = useDrApp();
    const moveTurns = useMoveTurns();
    const deleteTurns = useDeleteTurns();
    const [isLoading, setIsLoading] = useState(false);

    const mutate = async ({ value, unit }: DelayType) => {
        const now = moment(await getCurrentDate()).unix();
        const endOfDay = moment().endOf('day').unix();
        setIsLoading(true);

        try {
            if (value === 'vacation') {
                await deleteTurns.mutateAsync({
                    centerId: center.id,
                    data: {
                        from: now,
                        to: endOfDay
                    }
                });
                setIsLoading(false);

                toast.success('امروز برای شما مرخصی ثبت شد.');
                return router.push('/setting');
            }

            const workHours = await getWorkHours({
                center_id: center.id
            });
            const nearestShift = await getNearestShift(workHours?.data?.workhours);

            if (!nearestShift) {
                setIsLoading(false);
                return toast.error('ساعت کاری برای امروز وجود ندارد.');
            }

            const targetTime =
                now >= nearestShift.from
                    ? moment(now * 1000)
                          .add(value, unit)
                          .unix()
                    : moment(nearestShift.from * 1000)
                          .add(value, unit)
                          .unix();

            const data = await moveTurns.mutateAsync({
                centerId: center.id,
                data: {
                    book_from: now >= nearestShift.from ? now : nearestShift.from,
                    book_to: targetTime,
                    target_from: targetTime,
                    confirmed: true
                }
            });

            setIsLoading(false);
            if ((data.status as any) === 'NO_RECORD') {
                return toast.warn('نوبتی در شیفت فعلی وجود ندارد.');
            }
            toast.success('تاخیر شما ثبت شد و به بیماران پیام ارسال شد.');
            router.push('/setting');
        } catch (error) {
            setIsLoading(false);
            if (axios.isAxiosError(error)) toast.error(error.response?.data?.message);
        }
    };

    return { mutate, isLoading };
};

const getNearestShift = async (workHours: WorkHours[]) => {
    const now = moment(await getCurrentDate()).unix();
    const sortedWorkHours = sortBy(
        workHours.filter(workHour => +workHour.day === new Date().getDay()),
        ['from']
    );

    const onShiftNow = sortedWorkHours.find(
        workHour =>
            now >= timeFormmatedToUnix(workHour.from) && now < timeFormmatedToUnix(workHour.to)
    );

    const beforeShift = sortedWorkHours.find(workHour => now < timeFormmatedToUnix(workHour.from));

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
