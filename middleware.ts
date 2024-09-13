import { defaultLocale, Locale, locales } from '@/i18n/config';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const headers = request.headers;
  const acceptedLanguages = headers
    .get('Accept-Language')
    ?.split(/[;\-,]/)
    .filter((lang) => lang) //
    .filter((lang) => locales.includes(lang as Locale));

  const locale = acceptedLanguages //
    ? acceptedLanguages[0]
    : defaultLocale;

  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return;

  request.nextUrl.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|assets|_next/image|favicon.ico|robots.txt|.*sitemap|ads).*)',
  ],
};
