import { client } from '../../../client';

export const getGallery = async params => {
    return await client.get(`/doctor/center/gallery`, { params });
};
