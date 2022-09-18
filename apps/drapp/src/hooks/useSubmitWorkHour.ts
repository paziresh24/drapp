import CONSULT_CENTER_ID from '@paziresh24/constants/consultCenterId';
import { useDrApp } from '@paziresh24/context/drapp';
import { useWorkHours } from '@paziresh24/hooks/drapp/fillInfo';
import { getSplunkInstance } from '@paziresh24/shared/ui/provider';
import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { useWorkHoursStore } from '../store/workhours.store';

export const useSubmitWorkHour = () => {
    const workHoursMutateRequest = useWorkHours();
    const duration = useWorkHoursStore(state => state.duration);
    const workHours = useWorkHoursStore(state => state.workHours);

    const submitWorkHour = async ({
        centerId
    }: {
        centerId: string;
    }): Promise<AxiosResponse<any, any>> => {
        try {
            const data = await workHoursMutateRequest.mutateAsync({
                center_id: centerId,
                cost: 0,
                ...(centerId !== CONSULT_CENTER_ID && { duration }),
                workHours
            });

            toast.success('ساعت کاری شما ذخیره شد.');

            return Promise.resolve(data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.data?.errors) {
                    Object.values(error.response?.data?.errors).forEach((messages: any) => {
                        messages.forEach((message: string) => {
                            toast.error(message);
                        });
                    });
                } else {
                    toast.error(error.response?.data?.message);
                }
            }
            return Promise.reject(error);
        }
    };

    return { submitWorkHour, isLoading: workHoursMutateRequest.isLoading };
};
