import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardSidebarNav } from "@/components/dashboard/sidebar-nav"
import { AssetsGallery } from "@/components/assets/assets-gallery"
import { isLocale, type Locale } from "@/lib/i18n"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
          overviewLabel: "Overview",
          cdcLabel: "Specifications",
          imagesLabel: "Images",
          pageTitle: "Image gallery",
          cardTitle: "Search & consultation",
          cardText:
            "Filter images by file name, find them quickly, and jump to the related specification.",
          recentSort: "Newest",
          cdcAssociation: "Linked to specification",
        }
      : {
          overviewLabel: "Aperçu",
          cdcLabel: "Cahiers des charges",
          imagesLabel: "Images",
          pageTitle: "Galerie d'images",
          cardTitle: "Recherche & consultation",
          cardText:
            "Filtrez vos images par nom de fichier, retrouvez-les rapidement et accédez au cahier des charges concerné.",
          recentSort: "Tri récent",
          cdcAssociation: "Associations CDC",
        }

  const items = [
    { href: `${base}/overview`, label: ui.overviewLabel },
    { href: `${base}/cdc`, label: ui.cdcLabel },
    { href: `${base}/images`, label: ui.imagesLabel },
  ]

  return (
    <DashboardShell
      title={ui.pageTitle}
      sidebar={
        <DashboardSidebarNav
          locale={locale as Locale}
          items={items}
          activePath={`${base}/images`}
        />
      }
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{ui.cardTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>{ui.cardText}</p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-md bg-muted/30 px-2 py-1 text-xs">{ui.recentSort}</span>
              <span className="rounded-md bg-muted/30 px-2 py-1 text-xs">{ui.cdcAssociation}</span>
            </div>
          </CardContent>
        </Card>

        <AssetsGallery locale={locale as Locale} />
      </div>
    </DashboardShell>
  )
}
