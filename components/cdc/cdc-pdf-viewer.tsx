import Image from "next/image"

import type { CdcSection } from "@/lib/cdc-template"
import { getCdcSectionTitle, getSectionFormConfig } from "@/lib/cdc-form"

type CdcDoc = {
  _id?: unknown
  title: string
  description?: string
  sections: CdcSection[]
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
}

function parseSectionContent(content: string): {
  values: Record<string, unknown>
  isJson: boolean
} {
  if (!content) return { values: {}, isJson: true }
  try {
    const parsed = JSON.parse(content) as unknown
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return { values: parsed as Record<string, unknown>, isJson: true }
    }
  } catch {
    // fall through
  }

  return { values: { content }, isJson: false }
}

function formatDate(value: Date | string | null | undefined, locale: string) {
  if (!value) return null
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(d)
}

function renderSectionText({
  section,
  locale,
}: {
  section: CdcSection
  locale: string
}) {
  const { values, isJson } = parseSectionContent(section.content)
  const config = getSectionFormConfig(locale === "en" ? "en" : "fr", section.key)

  const ui =
    locale === "en"
      ? {
          rawLabel: "Raw content",
        }
      : {
          rawLabel: "Contenu brut",
        }

  const fieldCards = config.fields.map((f) => {
    const raw = values[f.name]
    const value =
      typeof raw === "string"
        ? raw
        : raw === undefined || raw === null
          ? ""
          : String(raw)

    const display = value.trim().length ? value : "—"

    return (
      <div key={f.name} className="space-y-1">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {f.label}
        </div>
        <div className="whitespace-pre-wrap rounded-md bg-muted/30 p-3 text-sm leading-6">
          {display}
        </div>
      </div>
    )
  })

  const shouldShowRaw = !isJson && section.content.trim().length > 0

  return (
    <div className="space-y-4">
      {fieldCards}
      {shouldShowRaw ? (
        <div className="space-y-2">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {ui.rawLabel}
          </div>
          <pre className="whitespace-pre-wrap rounded-md bg-muted/30 p-3 text-xs leading-5">
            {section.content}
          </pre>
        </div>
      ) : null}
    </div>
  )
}

function renderAssets({
  section,
  locale,
}: {
  section: CdcSection
  locale: string
}) {
  const assets = section.assets ?? []
  if (!assets.length) return null

  const label = locale === "en" ? "Images / diagrams" : "Images / diagrammes"

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((a) => (
          <div key={a.assetId} className="overflow-hidden rounded-lg border bg-card">
            <div className="relative h-28 w-full">
              <Image
                src={a.url}
                alt={a.fileName}
                fill
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function renderSectionNode({
  section,
  depth,
  locale,
}: {
  section: CdcSection
  depth: number
  locale: string
}) {
  const hasChildren = (section.children?.length ?? 0) > 0

  const headingId = depth === 0 ? `part-${section.key}` : `section-${section.key}`

  const title = getCdcSectionTitle(
    locale === "en" ? "en" : "fr",
    section.key,
    section.title,
  )

  const heading =
    depth === 0
      ? (
          <h2 id={headingId} className="text-xl font-semibold leading-snug">
            {section.key} — {title}
          </h2>
        )
      : (
          <h3
            id={headingId}
            className="text-lg font-semibold leading-snug"
          >
            {section.key} — {title}
          </h3>
        )

  return (
    <div className="space-y-4">
      {heading}
      {renderSectionText({ section, locale })}
      {renderAssets({ section, locale })}
      {hasChildren ? (
        <div className="mt-6 space-y-8">
          {section.children!.map((child) =>
            renderSectionNode({ section: child, depth: depth + 1, locale })
          )}
        </div>
      ) : null}
    </div>
  )
}

export function CdcPdfViewer({
  cdc,
  locale,
}: {
  cdc: CdcDoc
  locale: string
}) {
  const ui =
    locale === "en"
      ? {
          tocTitle: "Summary (table of contents)",
          tocHint: "Click to navigate to sections.",
          docLabel: "Specification document",
          createdLabel: "Created",
          updatedLabel: "Updated",
        }
      : {
          tocTitle: "Résumé (sommaire)",
          tocHint: "Cliquez pour naviguer dans les parties.",
          docLabel: "Cahier des charges",
          createdLabel: "Créé",
          updatedLabel: "Modifié",
        }

  const tocLocale = locale === "fr" ? "fr-FR" : "en-US"
  const createdAt = formatDate(cdc.createdAt ?? null, tocLocale)
  const updatedAt = formatDate(cdc.updatedAt ?? null, tocLocale)

  return (
    <article className="mx-auto w-full max-w-4xl space-y-6">
      <header className="space-y-2">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {ui.docLabel}
        </div>
        <h1 className="text-3xl font-semibold leading-tight">{cdc.title}</h1>
        {cdc.description ? (
          <p className="text-sm leading-6 text-muted-foreground">
            {cdc.description}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
          {createdAt ? <span>{ui.createdLabel} : {createdAt}</span> : null}
          {updatedAt ? <span>{ui.updatedLabel} : {updatedAt}</span> : null}
        </div>
      </header>

      <section className="rounded-lg border bg-card p-4">
        <div className="text-sm font-medium">{ui.tocTitle}</div>
        <div className="mt-2 text-sm text-muted-foreground">{ui.tocHint}</div>
        <ul className="mt-3 space-y-1">
          {cdc.sections.map((part) => (
            <li key={part.key} className="text-sm">
              <a className="underline underline-offset-4 hover:text-foreground" href={`#part-${part.key}`}>
                {part.key} —{" "}
                {getCdcSectionTitle(locale === "en" ? "en" : "fr", part.key, part.title)}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-10">
        {cdc.sections.map((part) =>
          renderSectionNode({
            section: part,
            depth: 0,
            locale,
          })
        )}
      </section>
    </article>
  )
}

