import { client } from '../../../client';

interface Params {
    online_channels: { type: 'eitaa' | 'whatsapp' | 'eitaa_number'; channel: string }[];
}

export const updateMessengers = async (params: Params) => {
    return await client.patch(`/doctor/visit-channels`, params);
};
