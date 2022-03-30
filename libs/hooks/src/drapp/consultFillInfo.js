import { useMutation, useQuery } from 'react-query';
import { getWorkHours } from '@paziresh24/apis/drApp/consult-fillinfo/getWorkHours';
import { activeConsult } from '@paziresh24/apis/drApp/consult-fillinfo/activeConsult';

const useActiveConsult = () => {
    return useMutation(activeConsult);
};

const useGetWorkHours = params => {
    return useQuery(['getWorkHours', params], () => getWorkHours(params), {
        enabled: false
    });
};

export { useActiveConsult, useGetWorkHours };
