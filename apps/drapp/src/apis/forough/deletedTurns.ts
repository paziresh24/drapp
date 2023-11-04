import { useQuery } from 'react-query';
import { workflow } from '../workflow.client';

interface Params {
    user_center_id: string;
}

const getDeletedTurns = async ({ user_center_id }: Params) => {
    return await workflow.get(
        `/webhook/426a4647-c176-4644-88ef-7191d50ff6a4/delete-book/${user_center_id}`
    );
};

export const useGetDeletedTurns = (params: Params) => {
    return useQuery(['getDeletedTurns', params], () => getDeletedTurns(params));
};
