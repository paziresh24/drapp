import { rest } from 'msw';

interface AddBookToQueueRequestBody {
    book_id: string;
}

export const addBookToQueueHandlers = [
    rest.post<AddBookToQueueRequestBody>(
        'https://www.paziresh24.com/api/addBookToQueue',
        (req, res, ctx) => {
            return res(
                ctx.status(200),
                ctx.json({
                    status: '1',
                    booking_queue: {
                        id: 'd9496dab-8a9c-11ec-b44f-b888e3ef10f8',
                        queue_id: '87',
                        book_id: '8de5ac6c-8a9c-11ec-b44f-b888e3ef10f8',
                        center_id: '174',
                        title: 'تست تستی',
                        no: 19,
                        at: 1644516653,
                        active: 2,
                        is_reserved: 0,
                        prints: 0,
                        is_lock: 1,
                        present: 0,
                        queue_name: 'دکتر آسترکی',
                        priority: 0,
                        dependent_number: 1,
                        waiting: 1,
                        count: 0,
                        attendance_time: 1644516600,
                        message: ''
                    },
                    acceptance_queue: {
                        id: 'd95250cd-8a9c-11ec-b44f-b888e3ef10f8',
                        queue_id: '2',
                        book_id: '8de5ac6c-8a9c-11ec-b44f-b888e3ef10f8',
                        center_id: '174',
                        title: 'تست تستی',
                        no: 19,
                        at: 1644516653,
                        active: 2,
                        is_reserved: 0,
                        prints: 0,
                        is_lock: 1,
                        present: 0,
                        queue_name: 'صف صندوق',
                        priority: 1,
                        dependent_number: 0,
                        count: 0,
                        message:
                            req.body.book_id === 'b340c259-9c84-11ec-9b06-005056ade668'
                                ? 'test'
                                : ''
                    }
                })
            );
        }
    )
];