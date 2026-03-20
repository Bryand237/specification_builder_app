import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { LoginForm } from "@/components/auth/login-form"
import { isLocale } from "@/lib/i18n"

export const metadata: Metadata = {
  title: "Login",
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) {
    return null
  }

  const ui = locale === "en"
    ? { title: "Login", subtitle: "Access your dashboard and continue building your specifications." }
    : {
        title: "Connexion",
        subtitle: "Accède à ton dashboard et continue tes cahiers des charges.",
      }

  return (
    <div className="flex w-full min-h-[calc(100dvh-56px)] items-center justify-center overflow-y-auto px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="relative h-12 w-12 overflow-hidden rounded-full border bg-background">
            <Image
              src="/SB_logo.png"
              alt="Specifications Builder"
              fill
              className="rounded-full object-contain p-1"
            />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{ui.title}</h1>
            <p className="text-sm text-muted-foreground">{ui.subtitle}</p>
          </div>
        </div>

        <LoginForm />

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {locale === "en" ? "Don’t have an account yet?" : "Pas encore de compte ?"}{" "}
          <Link
            className="underline underline-offset-4"
            href={`/${locale}/signup`}
          >
            {locale === "en" ? "Create an account" : "Créer un compte"}
          </Link>
        </div>
      </div>
    </div>
  )
}
