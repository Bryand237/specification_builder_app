"use client"

import Image from "next/image"
import Link from "next/link"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Locale } from "@/lib/i18n"

type AssetListItem = {
  assetId: string
  fileName: string
  mimeType: string
  size: number
  uploadedAt: string
  url: string
  metadata?: {
    cdcId?: string
    sectionKey?: string
  }
}

export function AssetsGallery({ locale }: { locale: Locale }) {
  const [q, setQ] = React.useState("")
  const [items, setItems] = React.useState<AssetListItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const ui =
    locale === "en"
      ? {
          searchPlaceholder: "Search by file name...",
          clear: "Clear",
          loading: "Loading...",
          empty: "No images.",
          errorFallback: "Error",
          ariaSearch: "Search images",
        }
      : {
          searchPlaceholder: "Rechercher par nom de fichier...",
          clear: "Effacer",
          loading: "Chargement...",
          empty: "Aucune image.",
          errorFallback: "Erreur",
          ariaSearch: "Rechercher des images",
        }

  const uiLocale = locale === "fr" ? "fr-FR" : "en-US"
  const errorFallback = ui.errorFallback

  const formatBytes = (value: number) => {
    if (!Number.isFinite(value)) return "—"
    const units = ["B", "KB", "MB", "GB", "TB"]
    let idx = 0
    let v = value
    while (v >= 1024 && idx < units.length - 1) {
      v /= 1024
      idx++
    }
    return `${v.toFixed(v >= 10 || idx === 0 ? 0 : 1)} ${units[idx]}`
  }

  const formatUploadedAt = (value: string) => {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return null
    return new Intl.DateTimeFormat(uiLocale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(d)
  }

  React.useEffect(() => {
    const ac = new AbortController()

    async function run() {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        if (q.trim()) params.set("q", q.trim())

        const res = await fetch(`/api/assets?${params.toString()}`, {
          signal: ac.signal,
        })

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }

        const data = (await res.json()) as { items?: AssetListItem[] }
        setItems(Array.isArray(data.items) ? data.items : [])
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return
        setError(e instanceof Error ? e.message : errorFallback)
      } finally {
        setLoading(false)
      }
    }

    void run()

    return () => ac.abort()
  }, [q, errorFallback])

  return (
    <div className="space-y-4">
      <div className="flex max-w-md items-center gap-2">
        <Input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={ui.searchPlaceholder}
          aria-label={ui.ariaSearch}
        />
        {q.trim() ? (
          <Button type="button" size="sm" variant="ghost" onClick={() => setQ("")}>
            {ui.clear}
          </Button>
        ) : null}
      </div>

      {error ? (
        <div className="text-sm text-destructive">{error}</div>
      ) : null}

      {loading ? (
        <div className="text-sm text-muted-foreground">{ui.loading}</div>
      ) : null}

      {!loading && !items.length ? (
        <div className="text-sm text-muted-foreground">{ui.empty}</div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((a) => {
          const cdcHref = a.metadata?.cdcId
            ? `/${locale}/dashboard/cdc/${a.metadata.cdcId}`
            : null
          const uploadedAtLabel = formatUploadedAt(a.uploadedAt)

          return (
            <Card key={a.assetId} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-40 w-full bg-muted">
                  <Image
                    src={a.url}
                    alt={a.fileName}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-2 p-3">
                  <div className="truncate text-sm font-medium">{a.fileName}</div>

                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>{formatBytes(a.size)}</span>
                    {uploadedAtLabel ? (
                      <span>{uploadedAtLabel}</span>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {a.metadata?.sectionKey ? (
                      <Badge variant="secondary">{a.metadata.sectionKey}</Badge>
                    ) : null}

                    {cdcHref ? (
                      <Badge asChild>
                        <Link href={cdcHref}>{locale === "en" ? "Spec" : "CDC"}</Link>
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
