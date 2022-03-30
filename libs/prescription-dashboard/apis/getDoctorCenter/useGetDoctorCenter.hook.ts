import { useQuery } from 'react-query';
import { getDoctorCenter } from './getDoctorCenter.api';

export const useGetDoctorCenter = params => {
    return useQuery(['getDoctorCenter', params], () => getDoctorCenter(params), {
        enabled: false
    });
};
