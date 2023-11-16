import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextRequest } from 'next/server';

let locales = ['vi', 'en-US', 'nl'];
let defaultLocale = 'en-US';

function getLocale(request: NextRequest) {
	const headerLanguage = request.headers.get('accept-language');
	let languages = new Negotiator({
		headers: {
			'accept-language': headerLanguage ?? defaultLocale,
		},
	}).languages();
	return match(languages, locales, defaultLocale);
}

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);

	if (pathnameHasLocale) return;

	const locale = getLocale(request);
	request.nextUrl.pathname = `/${locale}${pathname}`;
	return Response.redirect(request.nextUrl);
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
