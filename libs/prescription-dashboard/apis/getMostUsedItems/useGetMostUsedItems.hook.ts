import { useQuery } from 'react-query';
import { getMostUsedItems } from './getMostUsedItems.api';

export const useGetMostUsedItems = params => {
    return useQuery(['getMostUsedItems', params], () => getMostUsedItems(params), {
        enabled: false
    });
};
