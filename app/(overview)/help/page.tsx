import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Aide",
}

export default function Page() {
  redirect("/fr/help")
}
