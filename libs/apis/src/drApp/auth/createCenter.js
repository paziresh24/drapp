import { client } from '../../client';

export const createCenter = async params => {
    return await client.post(
        `/doctor/center${params.ignore_shahkar ? '/ignoreShahkar' : ''}`,
        _.omit(params, ['ignore_shahkar'])
    );
};
