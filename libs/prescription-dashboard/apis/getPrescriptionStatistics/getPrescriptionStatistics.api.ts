import { client } from '../client';
import qs from 'query-string';
import omit from 'lodash/omit';

export const getPrescriptionStatistics = async params => {
    return await client.get(`/${params.level.toLowerCase()}/prescriptions/statistics`, {
        params: { ...omit(params, 'level') },
        paramsSerializer: params => qs.stringify(omit(params, 'level'))
    });
};
