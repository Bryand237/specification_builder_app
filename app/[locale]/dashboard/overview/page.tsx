import { Metadata } from "next"
import { auth } from "@/auth"
import Link from "next/link"
import { redirect } from "next/navigation"

import { getMongoClientPromise } from "@/lib/db/mongodb"
import { isLocale, type Locale } from "@/lib/i18n"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardSidebarNav } from "@/components/dashboard/sidebar-nav"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Aperçu" }

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

  const base = `/${locale}/dashboard`
  const ui =
    locale === "en"
      ? {
          overviewTitle: "Overview",
          overviewItems: {
            overview: "Overview",
            cdc: "Specifications",
            images: "Images",
          },
          cdcCardTitle: "Specifications",
          cdcCardText: (n: number) => (n === 1 ? "document available" : "documents available"),
          openList: "Open list",
          imagesTitle: "Images",
          imagesText: "Images uploaded in your specifications.",
          viewGallery: "View gallery",
          activityTitle: "Recent activity",
          noRecent: "No recent updates.",
          nextStepLabel: "Next step",
          nextStepContinue:
            "Continue with the latest document in read-only or edit mode.",
          nextStepCreate: "Create your first specification document.",
          recentTitle: "Your latest specifications",
          updatedLabel: "Updated",
          view: "View",
          shortcutsTitle: "Shortcuts",
          newCdc: "Create specification",
          manageCdc: "Manage my specifications",
          exploreImages: "Explore images",
          adviceTitle: "Tip",
          adviceText:
            "Start by filling the most important sections, then add your diagrams. You can then consult the full document in PDF mode to reread and share it.",
          emptyRecent: "No specification yet. Create one to get started.",
        }
      : {
          overviewTitle: "Aperçu",
          overviewItems: {
            overview: "Aperçu",
            cdc: "Cahiers des charges",
            images: "Images",
          },
          cdcCardTitle: "Cahiers des charges",
          cdcCardText: (n: number) => (n === 1 ? "document disponible" : "documents disponibles"),
          openList: "Ouvrir la liste",
          imagesTitle: "Images",
          imagesText: "Images uploadées dans vos cahiers.",
          viewGallery: "Voir la galerie",
          activityTitle: "Dernière activité",
          noRecent: "Aucune activité récente.",
          nextStepLabel: "Prochaine étape",
          nextStepContinue:
            "Continuez avec le dernier document en mode lecture ou édition.",
          nextStepCreate: "Créez votre premier cahier des charges.",
          recentTitle: "Vos derniers cahiers",
          updatedLabel: "Modifié",
          view: "Voir",
          shortcutsTitle: "Raccourcis",
          newCdc: "Créer un CDC",
          manageCdc: "Gérer mes CDC",
          exploreImages: "Explorer les images",
          adviceTitle: "Conseil",
          adviceText:
            "Commencez par remplir les sections les plus importantes, puis ajoutez vos diagrammes. Vous pourrez ensuite consulter le document complet en mode PDF pour le relire et le partager.",
          emptyRecent: "Aucun cahier pour le moment. Créez-en un pour commencer.",
        }

  const items = [
    { href: `${base}/overview`, label: ui.overviewItems.overview },
    { href: `${base}/cdc`, label: ui.overviewItems.cdc },
    { href: `${base}/images`, label: ui.overviewItems.images },
  ]

  const uiLocale = locale === "fr" ? "fr-FR" : "en-US"
  const formatDate = (value?: Date | string | null) => {
    if (!value) return null
    const d = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(d.getTime())) return null
    return new Intl.DateTimeFormat(uiLocale, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }).format(d)
  }

  const client = await getMongoClientPromise()
  const db = client.db()
  const userId = session.user.id

  const [cdcCount, assetCount, recentCdcs] = await Promise.all([
    db.collection("cdc").countDocuments({ userId }),
    db.collection("assets.files").countDocuments({ "metadata.userId": userId }),
    db.collection("cdc")
      .find({ userId })
      .project({ sections: 0 })
      .sort({ updatedAt: -1 })
      .limit(5)
      .toArray(),
  ])

  return (
    <DashboardShell
      title={ui.overviewTitle}
      sidebar={
        <DashboardSidebarNav
          locale={locale as Locale}
          items={items}
          activePath={`${base}/overview`}
        />
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>{ui.cdcCardTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{cdcCount}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {ui.cdcCardText(cdcCount)}
              </div>
              <div className="mt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/${locale}/dashboard/cdc`}>{ui.openList}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{ui.imagesTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{assetCount}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {ui.imagesText}
              </div>
              <div className="mt-4">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/${locale}/dashboard/images`}>{ui.viewGallery}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{ui.activityTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {recentCdcs[0]?.updatedAt
                  ? `${ui.updatedLabel} : ${
                      formatDate(recentCdcs[0].updatedAt) ?? "—"
                    }`
                  : ui.noRecent}
              </div>
              <div className="mt-3 text-sm">
                <div className="font-medium">{ui.nextStepLabel}</div>
                <div className="text-muted-foreground">
                  {recentCdcs[0]?._id
                    ? ui.nextStepContinue
                    : ui.nextStepCreate}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button asChild className="w-full">
                  <Link href={`/${locale}/dashboard/cdc/new`}>{locale === "en" ? "New" : "Nouveau"}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Card>
            <CardHeader>
              <CardTitle>{ui.recentTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentCdcs.length ? (
                recentCdcs.map((c) => {
                  const href = `/${locale}/dashboard/cdc/${String(c._id)}`
                  const updated = c.updatedAt ? formatDate(c.updatedAt) : null
                  return (
                    <div
                      key={String(c._id)}
                      className={cn(
                        "flex items-start justify-between gap-4 rounded-lg border bg-card/50 p-3"
                      )}
                    >
                      <div className="min-w-0">
                        <div className="truncate font-medium">
                          <Link href={href} className="hover:underline">
                            {c.title}
                          </Link>
                        </div>
                        {c.description ? (
                          <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {c.description}
                          </div>
                        ) : (
                          <div className="mt-1 text-sm text-muted-foreground">—</div>
                        )}
                        {updated ? (
                          <div className="mt-2 text-xs text-muted-foreground">
                            {ui.updatedLabel} : {updated}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex-shrink-0">
                        <Button asChild variant="outline" size="sm">
                          <Link href={href}>{ui.view}</Link>
                        </Button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-sm text-muted-foreground">
                  {ui.emptyRecent}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{ui.shortcutsTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full">
                  <Link href={`/${locale}/dashboard/cdc/new`}>{ui.newCdc}</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/${locale}/dashboard/cdc`}>{ui.manageCdc}</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/${locale}/dashboard/images`}>{ui.exploreImages}</Link>
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{ui.adviceTitle}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {ui.adviceText}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
