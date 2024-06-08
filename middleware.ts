import env from '@/constant/env';

import { createI18nMiddleware } from 'next-international/middleware';
import { NextRequest } from 'next/server';

const I18nMiddleware = createI18nMiddleware({
  locales: env.locales,
  defaultLocale: env.defaultLocale,
});

export function middleware(request: NextRequest) {
  return I18nMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|assets|_next/image|favicon.ico|sitemap).*)'],
};
