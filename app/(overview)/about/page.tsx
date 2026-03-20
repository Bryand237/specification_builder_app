import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "About",
}

export default function Page() {
  redirect("/fr/about")
}
