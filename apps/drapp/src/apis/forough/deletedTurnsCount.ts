import { useQuery } from 'react-query';
import { workflow } from '../workflow.client';

interface Params {
    user_center_id: string;
}

const getDeletedTurnsCount = async ({ user_center_id }: Params) => {
    return await workflow.get(
        `/webhook/dcb1b961-a4f4-4e7b-ae09-9145c5644124/deleted-book-30days/${user_center_id}`
    );
};

export const useGetDeletedTurnsCount = (params: Params, option?: Record<string, any>) => {
    return useQuery(['getDeletedTurnsCount', params], () => getDeletedTurnsCount(params), { ...option });
};