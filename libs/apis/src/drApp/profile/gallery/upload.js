import { client } from '../../../client';

export const uploadGallery = async params => {
    return await client.post(`/doctor/center/gallery`, params);
};
