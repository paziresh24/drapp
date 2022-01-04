import { client } from '../../../client';
import omit from 'lodash/omit';

export const turns = async params => {
    return await client.get(
        `${params.baseURL ? params.baseURL + '/lbook/V1/doctor' : '/doctor'}/visitors`,
        {
            params: omit(params, ['baseURL'])
        }
    );
};
