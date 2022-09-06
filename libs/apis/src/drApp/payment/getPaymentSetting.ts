import { client } from '../../client';

export interface Params {
    center_id: string;
}

export const getPaymentSetting = async (params: Params) => {
    return await client.get(`/doctor/payments/settings/`, { params });
};
