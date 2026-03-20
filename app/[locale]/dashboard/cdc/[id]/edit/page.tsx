import { redirect } from "next/navigation"
import Link from "next/link"

import { auth } from "@/auth"
import { CdcEditor } from "@/components/cdc/cdc-editor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardSidebarNav } from "@/components/dashboard/sidebar-nav"
import { isLocale, type Locale } from "@/lib/i18n"

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const session = await auth()
  const { locale, id } = await params

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
          pageTitle: "Edit specification document",
          overviewLabel: "Overview",
          cdcLabel: "Specifications",
          imagesLabel: "Images",
          modeTitle: "Edit mode",
          modeText:
            "Fill your sections using the guided interface, then click “Save” to store your changes.",
          viewPdf: "View in PDF mode",
        }
      : {
          pageTitle: "Édition du cahier des charges",
          overviewLabel: "Aperçu",
          cdcLabel: "Cahiers des charges",
          imagesLabel: "Images",
          modeTitle: "Mode édition",
          modeText:
            "Remplissez vos sections via l’interface guidée, puis cliquez sur “Sauvegarder” pour enregistrer.",
          viewPdf: "Voir en mode PDF",
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
          activePath={`${base}/cdc`}
        />
      }
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{ui.modeTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>{ui.modeText}</p>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/${locale}/dashboard/cdc/${id}`}>{ui.viewPdf}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <CdcEditor cdcId={id} locale={locale as Locale} />
      </div>
    </DashboardShell>
  )
}

