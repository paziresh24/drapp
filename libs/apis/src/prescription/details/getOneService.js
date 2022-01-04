import { client } from '../client';
import providers from '@paziresh24/constants/prescription.json';

export const getOneService = async ({ provider, id }) => {
    if (provider === providers.tamin) return await client.get(`/tamin-services/${id}`);
    if (provider === providers.salamat) return await client.get(`/salamat-searched-clauses/${id}`);
};
