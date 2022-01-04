import { useMutation, useQuery } from 'react-query';
import { getUser } from '@paziresh24/apis/drApp/goftino/getUser';
import { setUser } from '@paziresh24/apis/drApp/goftino/setUser';

const useSetUserGoftino = () => {
    return useMutation(setUser);
};

const useGetUserGoftino = params => {
    return useQuery(['getUserGoftino', params], () => getUser(params), {
        enabled: false
    });
};

export { useSetUserGoftino, useGetUserGoftino };
