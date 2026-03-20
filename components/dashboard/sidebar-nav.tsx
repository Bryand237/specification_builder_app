import Link from "next/link"

import type { Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export type DashboardNavItem = {
  href: string
  label: string
}

export function DashboardSidebarNav({
  locale,
  items,
  activePath,
}: {
  locale: Locale
  items: DashboardNavItem[]
  activePath: string
}) {
  const ui =
    locale === "en"
      ? { title: "Dashboard", languageLabel: "Language", footer: "Specifications Builder" }
      : {
          title: "Tableau de bord",
          languageLabel: "Langue",
          footer: "Specifications Builder",
        }

  return (
    <nav
      className="flex h-full flex-col gap-3"
      aria-label="Navigation du tableau de bord"
    >
      <div className="px-2">
        <div className="text-sm font-medium">{ui.title}</div>
        <div className="text-xs text-muted-foreground">
          {ui.languageLabel}: {locale.toUpperCase()}
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-1">
        {items.map((item) => {
          const active = activePath === item.href
          return (
            <Button
              key={item.href}
              asChild
              variant={active ? "secondary" : "ghost"}
              className={cn("justify-start", active && "font-medium")}
            >
              <Link href={item.href} aria-current={active ? "page" : undefined}>
                {item.label}
              </Link>
            </Button>
          )
        })}
      </div>
      <div className="mt-auto px-2 text-xs text-muted-foreground">{ui.footer}</div>
    </nav>
  )
}
