import { client } from '../../../client';

interface Params {
    online_channels: { type: 'igap' | 'whatsapp'; channel: string }[];
}

export const updateMessengers = async (params: Params) => {
    return await client.patch(`/doctor/visit-channels`, params);
};
