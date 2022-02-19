import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const { certificate, P24SESSION } = req.cookies;

    if (!certificate || !P24SESSION) {
        return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_CLINIC_BASE_URL}/signin/?url=${req.url}`
        );
    }
}
