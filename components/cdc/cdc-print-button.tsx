"use client"

import { useLocale } from "@/hooks/use-locale"
import { Button } from "@/components/ui/button"

export function CdcPrintButton({ className }: { className?: string }) {
  const locale = useLocale()
  const label = locale === "en" ? "Print" : "Imprimer"

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={() => window.print()}
    >
      {label}
    </Button>
  )
}

