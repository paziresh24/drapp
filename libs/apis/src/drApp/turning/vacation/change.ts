import { client } from '../../../client';

interface Params {
    from: number;
    to: number;
    center_id: string;
    old_from: number;
    old_to: number;
}

export const changeVacation = async ({ old_to, old_from, from, to, center_id }: Params) => {
    return await client.put(`/doctor/vacation/${center_id}`, {
        from,
        to,
        old_from,
        old_to
    });
};
