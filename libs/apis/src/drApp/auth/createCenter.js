import { apiGatewayClient } from '@paziresh24/apis/apiGatewayClient';
import omit from 'lodash/omit';

export const createCenter = async params => {
    return await apiGatewayClient.post(
        `/V1/doctor/center${params.ignore_shahkar ? '/ignoreShahkar' : ''}`,
        omit(params, ['ignore_shahkar'])
    );
};
