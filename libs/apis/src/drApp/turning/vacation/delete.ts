import { client } from '../../../client';

interface Params {
    from: number;
    to: number;
    center_id: string;
}

export const deleteVacation = async ({ from, to, center_id }: Params) => {
    return await client.delete(`/doctor/vacation/${center_id}`, { params: { from, to } });
};
