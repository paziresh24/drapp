import { useQuery } from 'react-query';
import { info } from '@paziresh24/apis/drApp/home/info';
import { revenue } from '@paziresh24/apis/drApp/home/revenue';
import { books } from '@paziresh24/apis/drApp/home/books';

const useGetInfo = () => {
    return useQuery('getInfo', info, {
        enabled: false
    });
};

const useGetRevenue = params => {
    return useQuery(['getRevenue', params], () => revenue(params), {
        enabled: false
    });
};

const useGetBooks = params => {
    return useQuery(['getBooks', params], () => books(params), {
        enabled: false
    });
};

export { useGetInfo, useGetRevenue, useGetBooks };
