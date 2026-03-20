"use client"

import { useMemo } from "react"

import type { CdcSection } from "@/lib/cdc-template"
import type { Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { getCdcSectionTitle } from "@/lib/cdc-form"

type TreeItem = {
  key: string
  depth: number
}

function flatten(sections: CdcSection[], depth: number): TreeItem[] {
  const out: TreeItem[] = []
  for (const s of sections) {
    out.push({ key: s.key, depth })
    if (s.children?.length) {
      out.push(...flatten(s.children, depth + 1))
    }
  }
  return out
}

export function SectionsTree({
  locale,
  sections,
  selectedKey,
  onSelect,
}: {
  locale: Locale
  sections: CdcSection[]
  selectedKey: string
  onSelect: (key: string) => void
}) {
  const items = useMemo(() => flatten(sections, 0), [sections])

  return (
    <div className="flex flex-col gap-1">
      {items.map((item) => {
        const active = item.key === selectedKey
        return (
          <Button
            key={item.key}
            type="button"
            variant={active ? "secondary" : "ghost"}
            className={cn("justify-start", active && "font-medium")}
            style={{ paddingLeft: 12 + item.depth * 12 }}
            onClick={() => onSelect(item.key)}
            aria-pressed={active}
          >
            <span className="truncate">
              {item.key}. {getCdcSectionTitle(locale, item.key)}
            </span>
          </Button>
        )
      })}
    </div>
  )
}
