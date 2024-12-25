import acceptLanguage from 'accept-language';
import { NextRequest, NextResponse, userAgent } from 'next/server';

import { cookieName, defaultLocale, locales } from '@/i18n/config';

acceptLanguage.languages(locales as any);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest|sitemap.xml).*)'],
};

export function middleware(req: NextRequest) {
  const { isBot } = userAgent(req);

  let language;
  if (req.cookies.has(cookieName)) language = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  if (!language) language = acceptLanguage.get(req.headers.get('Accept-Language'));
  if (!language) language = defaultLocale;

  if (!locales.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) && !req.nextUrl.pathname.startsWith('/_next')) {
    if (isBot) {
      return;
    }

    return NextResponse.redirect(new URL(`/${language}${req.nextUrl.pathname}`, req.url));
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
