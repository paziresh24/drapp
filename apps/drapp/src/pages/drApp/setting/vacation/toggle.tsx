import { Switch } from '@mui/material';
import { useDrApp } from '@paziresh24/context/drapp';
import { useDeleteVacation, useGetVacation, useVacation } from '@paziresh24/hooks/drapp/turning';
import axios from 'axios';
import moment from 'jalali-moment';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

const currentDate = moment().unix();
const endDate = 1943728199;
export const VacationToggle = () => {
    const [info] = useDrApp();
    const [isOn, setIsOn] = useState(false);

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
            setIsOn(getVacation.data?.data?.length > 0);
        }
    }, [getVacation.status]);

    const onChange = async (status: boolean) => {
        try {
            if (status) {
                setIsOn(true);
                await vacationRequest.mutateAsync({
                    centerId: info.center.id,
                    data: {
                        from: moment().unix(),
                        to: endDate
                    }
                });

                return;
            }
            setIsOn(false);
            await deleteVacation.mutateAsync({
                center_id: info.center.id,
                from: moment().unix(),
                to: endDate
            });
        } catch (error) {
            if (axios.isAxiosError(error)) toast.error(error.response?.data?.message);
            setIsOn(prev => !prev);
        }
    };
    return (
        <Switch
            disabled={
                getVacation.isLoading || vacationRequest.isLoading || deleteVacation.isLoading
            }
            checked={isOn}
            onChange={e => onChange(e.currentTarget.checked)}
        />
    );
};
