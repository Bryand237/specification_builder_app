import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Login",
}

export default function Page() {
  redirect("/fr/login")
}
