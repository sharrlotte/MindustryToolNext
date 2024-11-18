import { MiddlewareConfig, NextRequest, NextResponse, userAgent } from 'next/server';

import { Locale, defaultLocale, locales } from '@/i18n/config';

export function middleware(request: NextRequest) {
  const { isBot } = userAgent(request);

  console.log('middleware hmm');

  let locale = request.cookies.get('Locale')?.value?.toLowerCase() as string | undefined;

  if (!locale) {
    const headers = request.headers;
    const acceptedLanguages = headers
      .get('Accept-Language')
      ?.split(/[;\-,]/)
      .filter((lang) => lang) //
      .map((lang) => lang.toLowerCase().trim()) //
      .filter((lang) => locales.includes(lang as Locale));

    locale = acceptedLanguages //
      ? acceptedLanguages[0]
      : defaultLocale;
  }

  if (!locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

  const currentLocale = pathname.slice(1, 3).toLowerCase();

  if (pathnameHasLocale) {
    if (isBot) {
      return;
    }
  }

  if (pathnameHasLocale && currentLocale === locale) {
    return;
  }
  request.nextUrl.pathname = pathnameHasLocale ? `/${locale}/${pathname.slice(4)}` : `/${locale}${pathname}`;

  const response = NextResponse.redirect(request.nextUrl);

  response.cookies.set('Locale', locale, { path: '/' });

  return response;
}

export const config: MiddlewareConfig = {
  matcher: [
    {
      source: '/((?!api|_next|en|vi|ru|kr|cn|uk|jp|assets|_next/image|favicon.ico|robots.txt|.*sitemap|ads).*)',
    },
  ],
};
