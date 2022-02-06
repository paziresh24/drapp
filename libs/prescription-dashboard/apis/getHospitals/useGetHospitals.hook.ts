import { useQuery } from 'react-query';
import { getHospitals } from './getHospitals.api';

export const useGetHospitals = params => {
    return useQuery(['getHospitals', params], () => getHospitals(params), { enabled: false });
};
