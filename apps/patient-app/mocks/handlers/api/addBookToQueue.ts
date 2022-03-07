import { rest } from 'msw';

export const addBookToQueueHandlers = [
    rest.get('https://www.paziresh24.com/api/addBookToQueue', (req, res, ctx) => {
        const { P24SESSION: p24session, certificate } = req.cookies;

        if (!p24session || !certificate) {
            return res(ctx.status(401));
        }

        return res(ctx.status(200), ctx.json([]));
    })
];
