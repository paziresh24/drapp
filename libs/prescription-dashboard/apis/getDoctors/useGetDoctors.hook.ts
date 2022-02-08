import { useQuery } from 'react-query';
import { getDoctors } from './getDoctors.api';

export const useGetDoctors = params => {
    return useQuery(['getDoctors', params], () => getDoctors(params), {
        enabled: false
    });
};
