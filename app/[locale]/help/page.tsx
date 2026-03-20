import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
          title: "FAQ & Help",
          quickGuideTitle: "Quick guide",
          quickGuideSteps: [
            "Create a specification document from the dashboard.",
            "Select a section in the sidebar and fill the guided fields.",
            "Add images/diagrams in the dedicated area when available.",
          ],
          needStart: "Need to get started? Open the dashboard.",
          goToDashboard: "Go to dashboard",
          faq: [
            {
              q: "How do I create a specification document?",
              a: "Go to “Specifications” (Cahiers des charges) and click “New”. The form asks for a title and a description.",
            },
            {
              q: "Where do I enter the section content?",
              a: "In the specification editor, choose a section on the left. Fields are shown on the right and the input is guided by the section configuration.",
            },
            {
              q: "How do I save my changes?",
              a: "Click “Save” in the section card. A confirmation message will appear.",
            },
            {
              q: "How do I add images or diagrams?",
              a: "When the section allows it, use the image upload field. Files are linked to the section and visible in the editor and on the Images page.",
            },
            {
              q: "What if I don’t see any images?",
              a: "Make sure you uploaded a file in the correct section. If the upload failed, try again and verify you uploaded an image file only.",
            },
            {
              q: "Can I update my document later?",
              a: "Yes. Open your document from the list, then continue writing section by section. Your saved entries are kept.",
            },
          ],
        }
      : {
          title: "FAQ & aide",
          quickGuideTitle: "Guide rapide",
          quickGuideSteps: [
            "Créez un cahier des charges depuis le dashboard.",
            "Sélectionnez une section dans la barre latérale et remplissez les champs.",
            "Ajoutez des images/diagrammes dans la zone dédiée lorsque disponible.",
          ],
          needStart: "Besoin de commencer ? Ouvrez le tableau de bord.",
          goToDashboard: "Aller au dashboard",
          faq: [
            {
              q: "Comment créer un cahier des charges ?",
              a: "Allez dans le menu “Cahiers des charges”, puis cliquez sur “Nouveau”. Le formulaire vous demande un titre et une description.",
            },
            {
              q: "Où saisir le contenu des sections ?",
              a: "Dans l’éditeur du cahier des charges, choisissez une section à gauche. Les champs sont affichés à droite et la saisie est guidée selon la configuration de la section.",
            },
            {
              q: "Comment sauvegarder mes modifications ?",
              a: "Cliquez sur “Sauvegarder” dans la carte de la section. Un message de confirmation s’affiche.",
            },
            {
              q: "Comment ajouter des images ou diagrammes ?",
              a: "Quand la section le permet, utilisez le champ d’upload d’images. Les fichiers sont associés à la section et visibles dans l’éditeur et dans la page “Images”.",
            },
            {
              q: "Que faire si je ne vois aucune image ?",
              a: "Vérifiez que vous avez bien uploadé un fichier dans la bonne section. Si l’upload a échoué, un message d’erreur s’affiche : réessayez et contrôlez le type de fichier (images uniquement).",
            },
            {
              q: "Puis-je modifier mon cahier des charges plus tard ?",
              a: "Oui. Ouvrez votre cahier des charges depuis la liste, puis reprenez la saisie section par section. Vos enregistrements sont conservés.",
            },
          ],
        }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{ui.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{ui.quickGuideTitle}</p>
            <div className="mt-2 space-y-2">
              {ui.quickGuideSteps.map((s, idx) => (
                <p key={idx}>
                  {idx + 1}) {s}
                </p>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {ui.faq.map((f) => (
              <details
                key={f.q}
                className="group rounded-lg border bg-card px-4 py-3"
              >
                <summary className="cursor-pointer text-sm font-medium">{f.q}</summary>
                <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {f.a}
                </div>
              </details>
            ))}
          </div>

          <Separator />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">{ui.needStart}</div>
            <Button asChild>
              <Link href={dashboardHref}>{ui.goToDashboard}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
