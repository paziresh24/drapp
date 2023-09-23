import {  useQuery } from 'react-query';
import { apiGatewayClient } from '../apiGatewayClient';

export const getUser = async () => {
    return await apiGatewayClient.get(`/v1/auth/me`);
};

export const useGetUser = () => useQuery(['getUser'], getUser, { enabled: false });
