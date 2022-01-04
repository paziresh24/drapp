import { client } from '../../../client';

export const deleteGallery = async params => {
    return await client.delete(`/doctor/center/gallery/${params.id}`);
};
