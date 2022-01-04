import { client } from '../client';
import omit from 'lodash/omit';

export const checkOtp = async param => {
    return await client.post(
        `/users-permissions/auth/local/checkOtp`,
        omit(param, ['identifier']),
        {
            params: {
                identifier: param.identifier
            }
        }
    );
};
