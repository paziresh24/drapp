import { client } from '@paziresh24/apis/client';

export interface Params {
    center_id: string;
}

export const getPaymentSetting = async (params: Params) => {
    return await client.get(`/doctor/payments/settings/`, { params });
};
