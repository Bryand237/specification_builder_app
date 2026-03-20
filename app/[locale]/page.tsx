import Link from "next/link"
import Image from "next/image"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getDictionary, isLocale } from "@/lib/i18n"

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) {
    return null
  }

  const dict = getDictionary(locale)
  const ui =
    locale === "en"
      ? {
          howItWorks: "See how it works",
          whatYouGetTitle: "What you get",
          whatYouGetDesc:
            "A guided structure to write, version, and illustrate your specifications.",
          bullet1Title: "Hierarchical outline",
          bullet1Text: "Navigate section by section and keep a clean document.",
          bullet2Title: "Dedicated forms",
          bullet2Text: "Each section has tailored fields (Mode 2).",
          bullet3Title: "Images & diagrams",
          bullet3Text: "Upload per section, store in GridFS, and use a dedicated gallery.",
          workflowTitle: "A clear workflow, from brief to final specification",
          workflowText:
            "Write progressively: context, architecture, features, technical details, constraints. Add your mockups and diagrams in the right place.",
          step1Title: "1. Create a specification",
          step1Desc: "Provide a title, then complete the guided outline.",
          step2Title: "2. Fill in by section",
          step2Desc: "Dedicated fields to avoid missing anything.",
          step3Title: "3. Illustrate",
          step3Desc: "Add diagrams/mockups, immediately visible.",
          readyTitle: "Ready to get started?",
          readyText: "Create your account and start your first specification document.",
          signUp: "Sign up",
          signIn: "Log in",
        }
      : {
          howItWorks: "Voir comment ça marche",
          whatYouGetTitle: "Ce que tu obtiens",
          whatYouGetDesc:
            "Une structure guidée pour écrire, versionner et illustrer ton cahier des charges.",
          bullet1Title: "Sommaire hiérarchique",
          bullet1Text: "Navigue section par section et garde un document propre.",
          bullet2Title: "Formulaires dédiés",
          bullet2Text: "Chaque section a ses champs adaptés (Mode 2).",
          bullet3Title: "Images & diagrammes",
          bullet3Text: "Upload par section, stockage GridFS et galerie dédiée.",
          workflowTitle: "Un workflow clair, du brief au CDC final",
          workflowText:
            "Rédige progressivement : contexte, architecture, fonctionnalités, technique, contraintes. Ajoute tes maquettes et diagrammes au bon endroit.",
          step1Title: "1. Crée un CDC",
          step1Desc: "Donne un titre, puis complète le sommaire guidé.",
          step2Title: "2. Renseigne par section",
          step2Desc: "Des champs dédiés pour éviter les oublis.",
          step3Title: "3. Illustre",
          step3Desc: "Ajoute des diagrammes/maquettes, visibles directement.",
          readyTitle: "Prêt à démarrer ?",
          readyText: "Crée ton compte et commence ton premier cahier des charges.",
          signUp: "Créer un compte",
          signIn: "Se connecter",
        }

  return (
    <div className="grid gap-10">
      <section className="relative overflow-hidden rounded-2xl border bg-card">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/sb-bg.png"
            alt=""
            fill
            priority
            className="object-cover opacity-15"
          />
        </div>

        <div className="grid gap-10 px-6 py-12 md:grid-cols-2 md:items-center md:px-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border bg-background">
                <Image
                  src="/SB_logo.png"
                  alt="Specifications Builder"
                  fill
                  className="rounded-full object-contain p-1"
                />
              </div>
              <div className="text-sm font-medium text-muted-foreground">
                {dict.home.title}
              </div>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              {dict.home.subtitle}
            </h1>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href={`/${locale}/signup`}>{dict.home.cta}</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href={`/${locale}/help`}>{ui.howItWorks}</Link>
              </Button>
            </div>
          </div>

          <Card className="bg-background/60">
            <CardHeader>
              <CardTitle>{ui.whatYouGetTitle}</CardTitle>
              <CardDescription>{ui.whatYouGetDesc}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="flex gap-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                <div>
                  <div className="font-medium">{ui.bullet1Title}</div>
                  <div className="text-sm text-muted-foreground">
                    {ui.bullet1Text}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                <div>
                  <div className="font-medium">{ui.bullet2Title}</div>
                  <div className="text-sm text-muted-foreground">
                    {ui.bullet2Text}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                <div>
                  <div className="font-medium">{ui.bullet3Title}</div>
                  <div className="text-sm text-muted-foreground">
                    {ui.bullet3Text}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            {ui.workflowTitle}
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground">
            {ui.workflowText}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>{ui.step1Title}</CardTitle>
              <CardDescription>{ui.step1Desc}</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{ui.step2Title}</CardTitle>
              <CardDescription>{ui.step2Desc}</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{ui.step3Title}</CardTitle>
              <CardDescription>{ui.step3Desc}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 rounded-2xl border bg-card p-6 md:p-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">{ui.readyTitle}</h3>
            <p className="text-sm text-muted-foreground">
              {ui.readyText}
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <Link href={`/${locale}/signup`}>{ui.signUp}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/${locale}/login`}>{ui.signIn}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
