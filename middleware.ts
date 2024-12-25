import { NextRequest, NextResponse, userAgent } from 'next/server'
import { cookieName, defaultLocale, locales } from '@/i18n/config'
import acceptLanguage from 'accept-language'

acceptLanguage.languages(locales as any)

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|site.webmanifest|sitemap.xml).*)']
}

export function middleware(req : NextRequest) {
  const {isBot} = userAgent(req);

  if (isBot){
    return NextResponse.next();
  }

  let language;
  if (req.cookies.has(cookieName)) language = acceptLanguage.get(req.cookies.get(cookieName)?.value)
  if (!language) language = acceptLanguage.get(req.headers.get('Accept-Language'))
  if (!language) language = defaultLocale

  if (
    !locales.some(loc => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(new URL(`/${language}${req.nextUrl.pathname}`, req.url))
  }

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') || '')
    const languageInReferer = locales.find((l) => refererUrl.pathname.startsWith(`/${l}`))
    const response = NextResponse.next()
    if (languageInReferer) response.cookies.set(cookieName, languageInReferer)
    return response
  }

  return NextResponse.next()
}
