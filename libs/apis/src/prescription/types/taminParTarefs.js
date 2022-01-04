import { client } from '../client';

export const taminParTarefs = async () => {
    return await client.get(`/tamin-par-tarefs`);
};
