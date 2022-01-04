import { useMutation, useQuery } from 'react-query';
import { workHours } from '@paziresh24/apis/drApp/fillInfo/workHours';
import { getWorkHours } from '@paziresh24/apis/drApp/fillInfo/getWorkHours';

const useWorkHours = () => {
    return useMutation(workHours);
};

const useGetWorkHours = params => {
    return useQuery(['getWorkHours', params], () => getWorkHours(params), {
        enabled: false
    });
};

export { useWorkHours, useGetWorkHours };
