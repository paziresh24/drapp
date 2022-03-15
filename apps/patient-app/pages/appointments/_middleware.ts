/* eslint-disable @next/next/no-server-import-in-page */
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const { certificate, P24SESSION: p24Session } = req.cookies;

    const siginPageRedirectUrl = `${process.env.NEXT_PUBLIC_CLINIC_BASE_URL}/signin/?url=${req.url}`;

    if (!certificate || !p24Session) {
        return NextResponse.redirect(siginPageRedirectUrl);
    }
}
