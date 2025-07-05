import acceptLanguage from 'accept-language';

import { cookieName, defaultLocale, locales } from '@/i18n/config';

import { NextRequest, NextResponse, userAgent } from 'next/server';

acceptLanguage.languages(locales as any);

export const config = {
	matcher: [
		'/((?!api|_next/static|_next/image|webmanifest|links|assets|favicon.ico|sw.js|site.webmanifest|sitemap|en|vi|kr|cn|jp|ru|uk).*)',
	],
};

export function middleware(req: NextRequest) {
	const { isBot } = userAgent(req);
    const pathname = req.nextUrl.pathname.startsWith("/") ? req.nextUrl.pathname : "/" + req.nextUrl.pathname;

	let language;
	if (req.cookies.has(cookieName)) language = acceptLanguage.get(req.cookies.get(cookieName)?.value);
	if (!language) language = acceptLanguage.get(req.headers.get('Accept-Language'));
	if (!language) language = defaultLocale;

	// Ignore auto local for google bot
	if (isBot) {
		return NextResponse.next();
	}

	if (!locales.some((loc) => pathname.startsWith(`/${loc}`)) && !pathname.startsWith('/_next')) {
		if (isBot) {
			return NextResponse.next();
		}

		req.nextUrl.pathname = `/${language}${pathname}`;

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
