import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextRequest } from 'next/server';
import cfg from '@/constant/global';

function getLocale(request: NextRequest) {
	const headerLanguage = request.headers.get('accept-language');
	let languages = new Negotiator({
		headers: {
			'accept-language': headerLanguage ?? cfg.defaultLocale,
		},
	}).languages();
	return match(languages, cfg.locales, cfg.defaultLocale);
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const pathnameHasLocale = cfg.locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

	if (pathnameHasLocale) return;

	const locale = getLocale(request);
	request.nextUrl.pathname = `/${locale}${pathname}`;
	return Response.redirect(request.nextUrl);
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
