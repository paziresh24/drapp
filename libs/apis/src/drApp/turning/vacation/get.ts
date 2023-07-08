import { client } from '../../../client';

type VacationFilter = {
    from?: number;
    to?: number;
};

interface Params {
    center_id: string;
    filter?: VacationFilter;
}

export const getVacation = async ({ center_id, filter }: Params) => {
    return await client.get(`/doctor/vacation/${center_id}`, { params: { ...filter } });
};
