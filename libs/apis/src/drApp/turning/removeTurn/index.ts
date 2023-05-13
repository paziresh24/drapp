import { client } from '../../../client';

interface Params {
    book_id: string;
}

export const removeTurn = ({ book_id }: Params) => {
    return client.delete(`/doctor/books/${book_id}/delete`);
};
