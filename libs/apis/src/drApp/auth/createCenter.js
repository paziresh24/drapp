import { client } from '../../client';
import omit from 'lodash/omit';

export const createCenter = async params => {
    return await client.post(
        `/doctor/center${params.ignore_shahkar ? '/ignoreShahkar' : ''}`,
        omit(params, ['ignore_shahkar'])
    );
};
