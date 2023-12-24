import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextRequest } from 'next/server';
import env from '@/constant/env';

function getLocale(request: NextRequest) {
  const headerLanguage = request.headers.get('accept-language');
  let languages = new Negotiator({
    headers: {
      'accept-language': headerLanguage ?? env.defaultLocale,
    },
  }).languages();
  return match(languages, env.locales, env.defaultLocale);
}

export function middleware(request: NextRequest) {
  let { pathname, hostname } = request.nextUrl;

  const hostnameHasVercel = hostname.includes('.vercel');
  const pathnameHasLocale = env.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale && !hostnameHasVercel) {
    return;
  }

  if (hostnameHasVercel) {
    request.nextUrl.hostname = hostname.replace('.vercel', '');
  }

  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${request.nextUrl.pathname}`;
  }

  return Response.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
