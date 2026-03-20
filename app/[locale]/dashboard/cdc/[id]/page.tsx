import { redirect } from "next/navigation"

import { ObjectId } from "mongodb"
import Link from "next/link"

import { auth } from "@/auth"
import { CdcPdfViewer } from "@/components/cdc/cdc-pdf-viewer"
import { CdcPrintButton } from "@/components/cdc/cdc-print-button"
import { CdcDeleteButton } from "@/components/cdc/cdc-delete-button"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardSidebarNav } from "@/components/dashboard/sidebar-nav"
import { isCdcSectionArray } from "@/lib/cdc-template"
import { getMongoClientPromise } from "@/lib/db/mongodb"
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
          overviewLabel: "Overview",
          cdcLabel: "Specifications",
          imagesLabel: "Images",
          pageTitle: "Specification document",
          notFoundTitle: "Not found",
          notFoundText: "The requested specification document does not exist or does not belong to your account.",
          invalidTitle: "Invalid content",
          invalidText: "The stored document format is incorrect.",
          headerHint: "Viewing your document (PDF mode).",
          edit: "Edit",
        }
      : {
          overviewLabel: "Aperçu",
          cdcLabel: "Cahiers des charges",
          imagesLabel: "Images",
          pageTitle: "Cahier des charges",
          notFoundTitle: "Introuvable",
          notFoundText:
            "Le cahier des charges demandé n’existe pas ou n’appartient pas à votre compte.",
          invalidTitle: "Contenu invalide",
          invalidText:
            "Le format enregistré pour ce cahier des charges est incorrect.",
          headerHint: "Lecture de votre document (mode PDF).",
          edit: "Modifier",
        }

  const items = [
    { href: `${base}/overview`, label: ui.overviewLabel },
    { href: `${base}/cdc`, label: ui.cdcLabel },
    { href: `${base}/images`, label: ui.imagesLabel },
  ]

  const client = await getMongoClientPromise()
  const db = client.db()
  const doc = await db.collection("cdc").findOne({
    _id: new ObjectId(id),
    userId: session.user.id,
  })

  if (!doc) {
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
        <Card>
          <CardHeader>
            <CardTitle>{ui.notFoundTitle}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {ui.notFoundText}
          </CardContent>
        </Card>
      </DashboardShell>
    )
  }

  if (!isCdcSectionArray(doc.sections)) {
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
        <Card>
          <CardHeader>
            <CardTitle>{ui.invalidTitle}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {ui.invalidText}
          </CardContent>
        </Card>
      </DashboardShell>
    )
  }

  const cdc = {
    title: String(doc.title ?? ""),
    description: doc.description ? String(doc.description) : undefined,
    sections: doc.sections,
    createdAt: doc.createdAt ?? null,
    updatedAt: doc.updatedAt ?? null,
  }

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          {ui.headerHint}
        </div>
        <div className="flex flex-wrap gap-2">
          <CdcPrintButton />
          <Button asChild variant="outline" size="sm">
            <Link href={`/${locale}/dashboard/cdc/${id}/edit`}>{ui.edit}</Link>
          </Button>
          <CdcDeleteButton cdcId={id} />
        </div>
      </div>

      <div className="mt-6">
        <CdcPdfViewer cdc={cdc} locale={locale} />
      </div>
    </DashboardShell>
  )
}
