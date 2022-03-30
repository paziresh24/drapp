import { useQuery } from 'react-query';
import { getLevels } from './getLevel.api';

export const useGetLevels = () => {
    return useQuery('getLevels', getLevels, {
        enabled: false
    });
};
