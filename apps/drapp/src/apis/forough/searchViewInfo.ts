import { client } from '@paziresh24/apis/client';
import { useQuery } from 'react-query';

export const searchViewInfo = async () => {
    return await client.get(
        `https://api.paziresh24.dev/doctor/v1/searchview-info?earliest_time=-30d&latest_time=now`
    );
};

export const useSearchViewInfo = () => useQuery('searchViewInfo', searchViewInfo);
