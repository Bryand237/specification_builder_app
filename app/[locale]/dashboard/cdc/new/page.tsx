import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardSidebarNav } from "@/components/dashboard/sidebar-nav"
import { NewCdcForm } from "@/components/cdc/new-cdc-form"
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
          pageTitle: "New specification document",
          cardTitle: "Create your document",
          cardText:
            "Start with a title and description. Then the interface will guide you section by section.",
          step1: "Create the specification document.",
          step2: "Fill the sections.",
          step3: "Add images if needed.",
        }
      : {
          overviewLabel: "Aperçu",
          cdcLabel: "Cahiers des charges",
          imagesLabel: "Images",
          pageTitle: "Nouveau cahier des charges",
          cardTitle: "Créer votre document",
          cardText:
            "Commencez par un titre et une description. Ensuite, l’interface vous guidera section par section.",
          step1: "Créez le cahier.",
          step2: "Remplissez les sections.",
          step3: "Ajoutez des images si nécessaire.",
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
            <CardTitle>{ui.cardTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>{ui.cardText}</p>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-foreground">1.</span>{" "}
                {ui.step1}
              </div>
              <div>
                <span className="font-medium text-foreground">2.</span>{" "}
                {ui.step2}
              </div>
              <div>
                <span className="font-medium text-foreground">3.</span>{" "}
                {ui.step3}
              </div>
            </div>
          </CardContent>
        </Card>

        <NewCdcForm locale={locale as Locale} />
      </div>
    </DashboardShell>
  )
}
