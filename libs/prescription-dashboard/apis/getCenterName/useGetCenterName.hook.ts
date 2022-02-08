import { useQuery } from 'react-query';
import { getCenterName } from './getCenterName.api';

export const useGetCenterName = params => {
    return useQuery(['getCenterName', params], () => getCenterName(params), {
        enabled: false
    });
};
