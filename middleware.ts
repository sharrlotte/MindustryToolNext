import acceptLanguage from 'accept-language';
import { NextRequest, NextResponse, userAgent } from 'next/server';

import { cookieName, defaultLocale, locales } from '@/i18n/config';

acceptLanguage.languages(locales as any);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest|sitemap|en|vi|kr|cn|jp|ru|uk).*)'],
};

export function middleware(req: NextRequest) {
  const { isBot } = userAgent(req);

  let language;
  if (req.cookies.has(cookieName)) language = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  if (!language) language = acceptLanguage.get(req.headers.get('Accept-Language'));
  if (!language) language = defaultLocale;

  // Ignore auto local for google bot
  if (locales.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) && isBot) {
    return NextResponse.next();
  }

  if (!locales.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) && !req.nextUrl.pathname.startsWith('/_next')) {
    if (isBot) {
      return NextResponse.next();
    }

    req.nextUrl.pathname = `/${language}${req.nextUrl.pathname}`;

    return NextResponse.redirect(req.nextUrl);
  }

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') || '');
    const languageInReferer = locales.find((l) => refererUrl.pathname.startsWith(`/${l}`));
    const response = NextResponse.next();

    if (languageInReferer) response.cookies.set(cookieName, languageInReferer);

    return response;
  }

  return NextResponse.next();
}
