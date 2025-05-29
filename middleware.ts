import acceptLanguage from 'accept-language';
import { NextRequest, NextResponse, userAgent } from 'next/server';

import { cookieName, defaultLocale, locales } from '@/i18n/config';

acceptLanguage.languages(locales as any);

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|links|assets|favicon.ico|sw.js|site.webmanifest|sitemap|en|vi|kr|cn|jp|ru|uk).*)'],
};

export function middleware(req: NextRequest) {
	console.time(req.url);
	const { isBot } = userAgent(req);

	let language;
	if (req.cookies.has(cookieName)) language = acceptLanguage.get(req.cookies.get(cookieName)?.value);
	if (!language) language = acceptLanguage.get(req.headers.get('Accept-Language'));
	if (!language) language = defaultLocale;

	// Ignore auto local for google bot
	if (locales.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) && isBot) {
		console.timeEnd(req.url);
		return NextResponse.next();
	}

	if (!locales.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) && !req.nextUrl.pathname.startsWith('/_next')) {
		if (isBot) {
			console.timeEnd(req.url);
			return NextResponse.next();
		}

		req.nextUrl.pathname = `/${language}${req.nextUrl.pathname}`;

		console.timeEnd(req.url);
		return NextResponse.redirect(req.nextUrl);
	}

	if (req.headers.has('referer')) {
		const refererUrl = new URL(req.headers.get('referer') || '');
		const languageInReferer = locales.find((l) => refererUrl.pathname.startsWith(`/${l}`));
		const response = NextResponse.next();

		if (languageInReferer) response.cookies.set(cookieName, languageInReferer);

		console.timeEnd(req.url);

		return response;
	}

	console.timeEnd(req.url);
	return NextResponse.next();
}
