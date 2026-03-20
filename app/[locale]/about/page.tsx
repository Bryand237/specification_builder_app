import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { isLocale } from "@/lib/i18n"

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) {
    return null
  }

  const dashboardHref = `/${locale}/dashboard/overview`
  const ui =
    locale === "en"
      ? {
          title: "Specifications Builder",
          description:
            "A tool to structure your project analysis and produce a complete specification document.",
          intro:
            "Build your documentation step by step, section after section. The result: a clear, consistent document ready to share.",
          badges: ["Section-based guidance", "Save & review", "Tree structure", "Images & diagrams"],
          howTitle: "How it works",
          steps: [
            "Create a specification document from the dashboard.",
            "Select a section in the sidebar and fill in the guided fields.",
            "Click “Save” to store your changes.",
            "Add images/diagrams in the dedicated area (when available).",
          ],
          getTitle: "What you get",
          getDescription: "A reusable structure that’s easy to maintain.",
          bullets: [
            "A clear hierarchy to organize your thinking.",
            "Coherent answers thanks to structured input.",
            "An actionable history: you revisit and refine your document over time.",
            "Centralized visuals to highlight key points.",
          ],
          tip: "Tip: start with the key sections, then refine as discussions evolve.",
          readyTitle: "Ready to get started?",
          readyText:
            "Open your dashboard and build your first specification document.",
          cta: "Go to dashboard",
        }
      : {
          title: "Specifications Builder",
          description:
            "Un outil pour structurer l’analyse d’un projet et produire un cahier des charges complet.",
          intro:
            "Vous construisez votre documentation étape par étape, section après section. Le résultat : un document clair, cohérent et prêt à être partagé.",
          badges: [
            "Guidage par sections",
            "Sauvegarde & relecture",
            "Arborescence",
            "Images & diagrammes",
          ],
          howTitle: "Comment ça marche ?",
          steps: [
            "Créez un cahier des charges depuis le dashboard.",
            "Sélectionnez une section dans la barre latérale et remplissez les champs guidés.",
            "Cliquez sur Sauvegarder pour enregistrer vos modifications.",
            "Ajoutez des images / diagrammes dans la zone dédiée (selon la section).",
          ],
          getTitle: "Ce que vous obtenez",
          getDescription: "Une structure réutilisable et facilement maintenable.",
          bullets: [
            "Une arborescence claire pour organiser votre réflexion.",
            "Des réponses cohérentes grâce à une saisie structurée.",
            "Un historique exploitable : vous reprenez et complétez votre document au fil de l’eau.",
            "Des visuels centralisés pour illustrer les points importants.",
          ],
          tip: "Conseil : commencez par les sections clés, puis affinez au fur et à mesure des discussions.",
          readyTitle: "Prêt à démarrer ?",
          readyText: "Ouvrez votre dashboard et construisez votre premier cahier des charges.",
          cta: "Aller au dashboard",
        }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{ui.title}</CardTitle>
          <CardDescription>{ui.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {ui.intro}
          </p>
          <div className="flex flex-wrap gap-2">
            {ui.badges.map((b) => (
              <Badge key={b} variant="secondary">
                {b}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{ui.howTitle}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ol className="list-decimal space-y-3 pl-5">
            {ui.steps.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{ui.getTitle}</CardTitle>
          <CardDescription>{ui.getDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <ul className="list-disc space-y-2 pl-5">
            {ui.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <Separator />
          <p className="text-xs text-muted-foreground">
            {ui.tip}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{ui.readyTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              {ui.readyText}
            </div>
            <Button asChild>
              <Link href={dashboardHref}>{ui.cta}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
