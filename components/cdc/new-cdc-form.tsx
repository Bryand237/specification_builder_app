"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import type { Locale } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { toast } from "sonner"

export function NewCdcForm({ locale }: { locale: Locale }) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const ui =
    locale === "en"
      ? {
          title: "Create a new specification document",
          formTitle: "New specification document",
          cdcTitleLabel: "Title",
          cdcTitleDesc: "Specification document name.",
          descriptionLabel: "Description",
          descriptionPlaceholder: "Project summary...",
          submit: "Create",
          submitting: "Creating...",
          errorCreate: "Unable to create the document.",
          invalidResponse: "Invalid response.",
          success: "Document created.",
        }
      : {
          title: "Créer un cahier des charges",
          formTitle: "Nouveau cahier des charges",
          cdcTitleLabel: "Titre",
          cdcTitleDesc: "Nom du cahier des charges.",
          descriptionLabel: "Description",
          descriptionPlaceholder: "Résumé du projet...",
          submit: "Créer",
          submitting: "Création...",
          errorCreate: "Impossible de créer le CDC",
          invalidResponse: "Réponse invalide",
          success: "CDC créé",
        }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch("/api/cdc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    })

    if (!res.ok) {
      toast.error(ui.errorCreate)
      setLoading(false)
      return
    }

    const body = (await res.json()) as { cdcId?: string }
    if (!body.cdcId) {
      toast.error(ui.invalidResponse)
      setLoading(false)
      return
    }

    toast.success(ui.success)
    router.push(`/${locale}/dashboard/cdc/${body.cdcId}/edit`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{ui.formTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel>{ui.cdcTitleLabel}</FieldLabel>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={locale === "en" ? "e.g. E-learning platform" : "Ex: Plateforme e-learning"}
                  required
                />
                <FieldDescription>{ui.cdcTitleDesc}</FieldDescription>
              </Field>
              <Field>
                <FieldLabel>{ui.descriptionLabel}</FieldLabel>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={ui.descriptionPlaceholder}
                />
              </Field>
            </FieldGroup>
          </FieldSet>

          <Button type="submit" disabled={loading}>
            {loading ? ui.submitting : ui.submit}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
