import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Sign up",
}

export default function Page() {
  redirect("/fr/signup")
}
