import { notFound } from "next/navigation"

import { SiteHeader } from "@/components/site-header"
import { isLocale, type Locale } from "@/lib/i18n"

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <SiteHeader locale={locale as Locale} />
      <div className="mx-auto w-full max-w-6xl px-4 py-8">{children}</div>
    </div>
  )
}
