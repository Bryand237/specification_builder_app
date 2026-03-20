import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

const locales = ["fr", "en"] as const
type Locale = (typeof locales)[number]

function hasLocale(pathname: string): pathname is `/${Locale}${string}` {
  return locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  )
}

export default function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  // Avoid redirecting Next.js public assets (images, css, js, etc).
  // Otherwise `/SB_logo.png` would become `/{locale}/SB_logo.png` and break.
  if (pathname.match(/\.[^/]+$/)) {
    return NextResponse.next()
  }

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next()
  }

  if (!hasLocale(pathname)) {
    const url = new URL(`/fr${pathname}${search}`, req.nextUrl.origin)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
}
