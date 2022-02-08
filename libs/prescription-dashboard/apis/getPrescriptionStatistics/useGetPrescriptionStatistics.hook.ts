import { useQuery } from 'react-query';
import { getPrescriptionStatistics } from './getPrescriptionStatistics.api';

export const useGetPrescriptionStatistics = params => {
    return useQuery(
        ['getPrescriptionStatistics', params],
        () => getPrescriptionStatistics(params),
        {
            enabled: false
        }
    );
};
