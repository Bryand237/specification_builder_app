"use client"

import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"

import type { Locale } from "@/lib/i18n"
import type { CdcSection } from "@/lib/cdc-template"
import { isCdcSectionArray } from "@/lib/cdc-template"
import { getCdcSectionTitle, getSectionFormConfig } from "@/lib/cdc-form"
import { SectionsTree } from "@/components/cdc/sections-tree"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

function cloneSections<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value)
  }
  return JSON.parse(JSON.stringify(value)) as T
}

type CdcDoc = {
  _id: string
  title: string
  description?: string
  sections: CdcSection[]
}

function SectionEditorPane({
  cdcId,
  section,
  config,
  locale,
  onSectionContentSaved,
  onAssetAdded,
}: {
  cdcId: string
  section: CdcSection
  config: ReturnType<typeof getSectionFormConfig>
  locale: Locale
  onSectionContentSaved: (key: string, content: string) => void
  onAssetAdded: (
    key: string,
    asset: { assetId: string; fileName: string; mimeType: string; url: string }
  ) => void
}) {
  const [formState, setFormState] = useState<Record<string, string>>(() =>
    buildFormDefaults(section.content, config.fields)
  )
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const ui = locale === "en"
    ? {
        save: "Save",
        saving: "Saving...",
        reset: "Reset",
        imagesHeading: "Images / diagrams",
        uploadLabel: "Upload an image (PNG/JPG/GIF)",
        noImages: "No images.",
        saveError: "Save failed",
        saveSuccess: "Section saved",
        uploadError: "Upload failed",
        uploadSuccess: "Image uploaded",
      }
    : {
        save: "Sauvegarder",
        saving: "Sauvegarde...",
        reset: "Réinitialiser",
        imagesHeading: "Images / diagrammes",
        uploadLabel: "Uploader une image (PNG/JPG/GIF)",
        noImages: "Aucune image.",
        saveError: "Échec de la sauvegarde",
        saveSuccess: "Section sauvegardée",
        uploadError: "Upload échoué",
        uploadSuccess: "Image uploadée",
      }

  async function saveSection() {
    setSaving(true)

    const payload: Record<string, unknown> = {}
    for (const f of config.fields) {
      payload[f.name] = formState[f.name] ?? ""
    }

    const content = stringifyContent(payload)

    const res = await fetch(`/api/cdc/${cdcId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: section.key,
        content,
      }),
    })

    if (!res.ok) {
      toast.error(ui.saveError)
      setSaving(false)
      return
    }

    toast.success(ui.saveSuccess)
    onSectionContentSaved(section.key, content)
    setSaving(false)
  }

  async function uploadAsset(file: File) {
    setUploading(true)

    const fd = new FormData()
    fd.append("sectionKey", section.key)
    fd.append("file", file)

    const res = await fetch(`/api/cdc/${cdcId}/assets`, {
      method: "POST",
      body: fd,
    })

    if (!res.ok) {
      toast.error(ui.uploadError)
      setUploading(false)
      return
    }

    const body = (await res.json()) as { assetId: string; url: string }

    toast.success(ui.uploadSuccess)
    onAssetAdded(section.key, {
      assetId: body.assetId,
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      url: body.url,
    })

    setUploading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {`${section.key}. ${getCdcSectionTitle(locale, section.key, section.title)}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FieldSet>
          <FieldGroup>
            {config.fields.map((f) => (
              <Field key={f.name}>
                <FieldLabel>{f.label}</FieldLabel>
                {f.description ? (
                  <FieldDescription>{f.description}</FieldDescription>
                ) : null}
                {f.type === "text" ? (
                  <Input
                    value={formState[f.name] ?? ""}
                    placeholder={f.placeholder}
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, [f.name]: e.target.value }))
                    }
                  />
                ) : (
                  <Textarea
                    value={formState[f.name] ?? ""}
                    placeholder={f.placeholder}
                    className="min-h-32"
                    onChange={(e) =>
                      setFormState((s) => ({ ...s, [f.name]: e.target.value }))
                    }
                  />
                )}
              </Field>
            ))}
          </FieldGroup>
        </FieldSet>

        <div className="flex items-center gap-2">
          <Button onClick={() => void saveSection()} disabled={saving}>
            {saving ? ui.saving : ui.save}
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setFormState(buildFormDefaults(section.content, config.fields))
            }
            disabled={saving}
            className="hidden md:inline-flex"
          >
            {ui.reset}
          </Button>
        </div>

        {config.supportsAssets || (section.assets?.length ?? 0) > 0 ? (
          <>
            <Separator />
            <div className="space-y-3">
              <div className="text-sm font-medium">{ui.imagesHeading}</div>
              {config.supportsAssets ? (
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  aria-label={ui.uploadLabel}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    void uploadAsset(file).finally(() => {
                      if (fileInputRef.current) fileInputRef.current.value = ""
                    })
                  }}
                />
              ) : null}

              {section.assets?.length ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {section.assets.map((a) => (
                    <Card key={a.assetId} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative h-32 w-full">
                          <Image
                            src={a.url}
                            alt={a.fileName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="truncate p-3 text-xs text-muted-foreground">
                          {a.fileName}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  {ui.noImages}
                </div>
              )}
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}

function findSection(sections: CdcSection[], key: string): CdcSection | null {
  for (const s of sections) {
    if (s.key === key) return s
    if (s.children?.length) {
      const found = findSection(s.children, key)
      if (found) return found
    }
  }
  return null
}

function parseJsonContent(content: string): Record<string, unknown> {
  if (!content) return {}
  try {
    const parsed = JSON.parse(content) as unknown
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as Record<string, unknown>
    }
  } catch {
    // ignore
  }
  return { content }
}

function stringifyContent(value: Record<string, unknown>): string {
  return JSON.stringify(value, null, 2)
}

function buildFormDefaults(
  content: string,
  fields: Array<{ name: string }>
): Record<string, string> {
  const parsed = parseJsonContent(content)
  const next: Record<string, string> = {}
  for (const f of fields) {
    const v = parsed[f.name]
    next[f.name] = typeof v === "string" ? v : ""
  }
  return next
}

export function CdcEditor({
  cdcId,
  locale,
}: {
  cdcId: string
  locale: Locale
}) {
  const [cdc, setCdc] = useState<CdcDoc | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedKey, setSelectedKey] = useState<string>("1.1")

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      const res = await fetch(`/api/cdc/${cdcId}`, { cache: "no-store" })
      if (!res.ok) {
        toast.error(locale === "en" ? "Unable to load the CDC" : "Impossible de charger le CDC")
        setLoading(false)
        return
      }
      const data = (await res.json()) as { item?: unknown }
      const item = data.item as Partial<CdcDoc> | undefined

      const sections = (item as { sections?: unknown })?.sections
      if (!isCdcSectionArray(sections)) {
        toast.error(
          locale === "en" ? "Invalid CDC (sections)" : "CDC invalide (sections)",
        )
        setLoading(false)
        return
      }

      const doc: CdcDoc = {
        _id: String((item as { _id?: unknown })._id ?? cdcId),
        title: String(item?.title ?? ""),
        description: item?.description ? String(item.description) : undefined,
        sections,
      }

      if (!active) return
      setCdc(doc)
      setLoading(false)

      const firstLeaf = sections.flatMap((s) =>
        s.children?.length ? s.children : [s]
      )[0]
      setSelectedKey(firstLeaf?.key ?? sections[0]?.key ?? "1.1")
    }

    void load()

    return () => {
      active = false
    }
  }, [cdcId, locale])

  const section = useMemo(() => {
    if (!cdc) return null
    return findSection(cdc.sections, selectedKey)
  }, [cdc, selectedKey])

  const config = useMemo(
    () => getSectionFormConfig(locale, selectedKey),
    [locale, selectedKey],
  )

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">
        {locale === "en" ? "Loading..." : "Chargement..."}
      </div>
    )
  }

  if (!cdc) {
    return (
      <div className="text-sm text-muted-foreground">
        {locale === "en" ? "CDC not found." : "CDC introuvable."}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-[300px_1fr]">
      <Card className="h-fit">
        <CardHeader>
            <CardTitle className="text-base">
              {locale === "en" ? "Sections" : "Sections"}
            </CardTitle>
        </CardHeader>
        <CardContent>
          <SectionsTree
              locale={locale}
            sections={cdc.sections}
            selectedKey={selectedKey}
            onSelect={setSelectedKey}
          />
        </CardContent>
      </Card>

      {section ? (
        <SectionEditorPane
          key={section.key}
          cdcId={cdcId}
          section={section}
          config={config}
          locale={locale}
          onSectionContentSaved={(key, content) => {
            if (!cdc) return
            const nextSections = cloneSections(cdc.sections)
            const target = findSection(nextSections, key)
            if (target) {
              target.content = content
            }
            setCdc({ ...cdc, sections: nextSections })
          }}
          onAssetAdded={(key, asset) => {
            if (!cdc) return
            const nextSections = cloneSections(cdc.sections)
            const target = findSection(nextSections, key)
            if (target) {
              target.assets = target.assets ? [...target.assets] : []
              target.assets.push(asset)
            }
            setCdc({ ...cdc, sections: nextSections })
          }}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {locale === "en" ? "Selection" : "Sélection"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {locale === "en" ? "Select a section." : "Sélectionne une section."}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
