"use client"

import { usePathname } from "next/navigation"

import { isLocale, type Locale } from "@/lib/i18n"

export function useLocale(): Locale {
  const pathname = usePathname()
  const locale = pathname.split("/")[1] || "fr"
  return isLocale(locale) ? locale : "fr"
}
