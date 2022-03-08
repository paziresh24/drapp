import { rest } from 'msw';

interface removeBookRequestBody {
    center_id: string;
    reference_code: string;
    national_code: string;
}

export const removeBookHandlers = [
    rest.post<removeBookRequestBody>(
        'https://www.paziresh24.com/api/deleteBook',
        (req, res, ctx) => {
            const { P24SESSION: p24session, certificate } = req.cookies;

            if (!p24session || !certificate) {
                return res(ctx.status(401));
            }

            return res(
                ctx.status(200),
                ctx.json({
                    status: 1
                })
            );
        }
    )
];
