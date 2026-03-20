import { notFound, redirect } from "next/navigation"

import { auth } from "@/auth"
import { isLocale, type Locale } from "@/lib/i18n"

export default async function Layout({
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

  const session = await auth()
  if (!session?.user?.id) {
    redirect(`/${locale}/login`)
  }

  return <div data-locale={locale as Locale}>{children}</div>
}
