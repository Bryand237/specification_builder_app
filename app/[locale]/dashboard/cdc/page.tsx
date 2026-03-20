import Link from "next/link"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { CdcDeleteButton } from "@/components/cdc/cdc-delete-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardSidebarNav } from "@/components/dashboard/sidebar-nav"
import { getMongoClientPromise } from "@/lib/db/mongodb"
import { isLocale, type Locale } from "@/lib/i18n"

type CdcListItem = {
  _id: string
  title: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const session = await auth()
  const { locale } = await params
  if (!session?.user?.id) {
    redirect(`/${locale}/login`)
  }
  if (!isLocale(locale)) {
    return null
  }

  const ui =
    locale === "en"
      ? {
          overviewLabel: "Overview",
          cdcLabel: "Specifications",
          imagesLabel: "Images",
          title: "Specifications",
          description: "Click a title to open the document in read-only mode.",
          newCdc: "New specification",
          images: "Images",
          emptyTitle: "No specifications yet",
          emptyText:
            "Start by creating your first specification document. Then you can navigate section by section, add text and diagrams, and finally consult the full document in PDF mode.",
          emptyCta: "Create a specification",
          tocCta: "Need help?",
          cardUpdated: "Updated",
          cardCreated: "Added",
          view: "View",
          edit: "Edit",
        }
      : {
          overviewLabel: "Aperçu",
          cdcLabel: "Cahiers des charges",
          imagesLabel: "Images",
          title: "Cahiers des charges",
          description: "Cliquez sur un titre pour afficher le document en mode lecture.",
          newCdc: "Nouveau",
          images: "Images",
          emptyTitle: "Aucun cahier des charges",
          emptyText:
            "Commencez par créer votre premier cahier des charges. Ensuite, vous pourrez naviguer dans chaque section, y ajouter du texte et des diagrammes, puis consulter le document en mode PDF.",
          emptyCta: "Créer un CDC",
          cardUpdated: "Modifié",
          cardCreated: "Ajouté",
          view: "Voir",
          edit: "Modifier",
        }

  const base = `/${locale}/dashboard`
  const items = [
    { href: `${base}/overview`, label: ui.overviewLabel },
    { href: `${base}/cdc`, label: ui.cdcLabel },
    { href: `${base}/images`, label: ui.imagesLabel },
  ]

  const uiLocale = locale === "fr" ? "fr-FR" : "en-US"
  const formatDate = (value?: string) => {
    if (!value) return null
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return value
    return new Intl.DateTimeFormat(uiLocale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(d)
  }

  let cdcs: CdcListItem[] = []
  try {
    const client = await getMongoClientPromise()
    const db = client.db()

    const docs = await db
      .collection("cdc")
      .find({ userId: session.user.id })
      .project({ sections: 0 })
      .sort({ updatedAt: -1 })
      .limit(50)
      .toArray()

    cdcs = docs.map((d) => ({
      _id: String(d._id),
      title: String(d.title ?? ""),
      description: d.description ? String(d.description) : undefined,
      createdAt: d.createdAt
        ? (d.createdAt instanceof Date
            ? d.createdAt.toISOString()
            : String(d.createdAt))
        : undefined,
      updatedAt: d.updatedAt
        ? (d.updatedAt instanceof Date
            ? d.updatedAt.toISOString()
            : String(d.updatedAt))
        : undefined,
    }))
  } catch {
    cdcs = []
  }

  return (
    <DashboardShell
      title={ui.title}
      sidebar={
        <DashboardSidebarNav
          locale={locale as Locale}
          items={items}
          activePath={`${base}/cdc`}
        />
      }
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">
            {cdcs.length}{" "}
            {cdcs.length === 1 ? (locale === "en" ? "document" : "cahier") : locale === "en" ? "documents" : "cahiers"}
          </div>
          <div className="text-xs text-muted-foreground">
            {ui.description}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href={`/${locale}/dashboard/cdc/new`}>{ui.newCdc}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/${locale}/dashboard/images`}>{ui.images}</Link>
          </Button>
        </div>
      </div>

      {cdcs.length === 0 ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{ui.emptyTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              {ui.emptyText}
            </p>
            <Button asChild>
              <Link href={`/${locale}/dashboard/cdc/new`}>{ui.emptyCta}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {cdcs.map((c) => {
            const viewHref = `/${locale}/dashboard/cdc/${c._id}`
            const editHref = `/${locale}/dashboard/cdc/${c._id}/edit`

            return (
              <Card key={c._id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-base">
                    <Link
                      className="hover:underline"
                      href={viewHref}
                      aria-label={`Voir : ${c.title}`}
                    >
                      {c.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div>{c.description || "—"}</div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {formatDate(c.createdAt) ? (
                      <span>{ui.cardCreated} : {formatDate(c.createdAt)}</span>
                    ) : null}
                    {formatDate(c.updatedAt) ? (
                      <span>{ui.cardUpdated} : {formatDate(c.updatedAt)}</span>
                    ) : null}
                  </div>
                </CardContent>
                <CardFooter className="mt-auto flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={viewHref}>{ui.view}</Link>
                  </Button>
                  <Button asChild size="sm" variant="secondary">
                    <Link href={editHref}>{ui.edit}</Link>
                  </Button>
                  <CdcDeleteButton cdcId={c._id} />
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </DashboardShell>
  )
}
