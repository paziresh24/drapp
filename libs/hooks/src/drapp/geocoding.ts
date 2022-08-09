import { useQuery } from 'react-query';
import { reverseGeocoding } from '@paziresh24/apis/drApp/geocoding/reverse';

export const useGetReverseGeocoding = (params: { lat: number; long: number }) => {
    return useQuery(['reverseGeocoding', params], () => reverseGeocoding(params), {
        enabled: false
    });
};
