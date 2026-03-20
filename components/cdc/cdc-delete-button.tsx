"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useLocale } from "@/hooks/use-locale"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function CdcDeleteButton({
  cdcId,
}: {
  cdcId: string
}) {
  const locale = useLocale()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const ui =
    locale === "en"
      ? {
          delete: "Delete",
          cancel: "Cancel",
          title: "Delete this specification document?",
          description:
            "This action deletes the specification document and its associated images. This cannot be undone.",
          success: "Specification document deleted.",
          error: "Unable to delete the specification document.",
          errorGeneric: "Error while deleting.",
          deleting: "Deleting...",
        }
      : {
          delete: "Supprimer",
          cancel: "Annuler",
          title: "Supprimer ce cahier des charges ?",
          description:
            "Cette action supprime le cahier des charges et ses images associées. Elle est irréversible.",
          success: "Cahier des charges supprimé.",
          error: "Impossible de supprimer le cahier des charges.",
          errorGeneric: "Erreur lors de la suppression.",
          deleting: "Suppression...",
        }

  async function onDelete() {
    setLoading(true)
    try {
      const res = await fetch(`/api/cdc/${cdcId}`, { method: "DELETE" })
      if (!res.ok) {
        toast.error(ui.error)
        return
      }
      toast.success(ui.success)
      setOpen(false)
      router.refresh()
    } catch {
      toast.error(ui.errorGeneric)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="destructive" size="sm">
          {ui.delete}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{ui.title}</DialogTitle>
          <DialogDescription>{ui.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            {ui.cancel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => void onDelete()}
            disabled={loading}
          >
            {loading ? ui.deleting : ui.delete}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

