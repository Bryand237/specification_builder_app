"use client"

import { Languages } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import type { Locale } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function switchLocaleInPath(pathname: string, nextLocale: Locale) {
  const parts = pathname.split("/")
  // pathname starts with '/'
  if (parts.length > 1) {
    parts[1] = nextLocale
    return parts.join("/") || "/"
  }
  return `/${nextLocale}`
}

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const query = searchParams.toString()

  function onSelect(nextLocale: Locale) {
    const nextPathname = switchLocaleInPath(pathname, nextLocale)
    router.push(query ? `${nextPathname}?${query}` : nextPathname)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Switch language">
          <Languages className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSelect("fr")}>
          Français{locale === "fr" ? " ✓" : ""}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelect("en")}>
          English{locale === "en" ? " ✓" : ""}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
