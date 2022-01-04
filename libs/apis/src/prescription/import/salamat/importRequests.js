import { client } from '../../client';

export const importRequestsSalamat = async params => {
    return await client.post(`/favorite-services/import`, params, {
        params
    });
};
