import { useDrApp } from '@paziresh24/context/drapp';
import { useDeleteTurns, useMoveTurns } from '@paziresh24/hooks/drapp/turning';
import moment from 'jalali-moment';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

export const useDelay = () => {
    const router = useHistory();
    const [{ center }] = useDrApp();
    const moveTurns = useMoveTurns();
    const deleteTurns = useDeleteTurns();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => handleLoading, [moveTurns.status, deleteTurns.status]);

    const mutate = async ({ value, type }: DelayType) => {
        const now = moment().unix();
        const delayTime = moment().add(value, type).unix();
        const endOfDay = moment().endOf('day').unix();

        try {
            if (type === 'days') {
                return await deleteTurns.mutateAsync({
                    centerId: center.id,
                    data: {
                        from: now,
                        to: endOfDay
                    }
                });
            }
            await moveTurns.mutateAsync({
                centerId: center.id,
                data: {
                    book_from: now,
                    book_to: delayTime,
                    target_from: delayTime,
                    confirmed: true
                }
            });

            toast.success('تاخیر شما ثبت شد و به بیماران پیام ارسال شد.');
            router.push('/');
        } catch (error) {
            if (axios.isAxiosError(error)) error.response?.data?.message;
        }
    };

    const handleLoading = useMemo(() => {
        setIsLoading(moveTurns.isLoading || deleteTurns.isLoading);
    }, [moveTurns.isLoading, deleteTurns.isLoading]);

    return { mutate, isLoading };
};
