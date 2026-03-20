import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { SignupForm } from "@/components/auth/signup-form"
import { isLocale } from "@/lib/i18n"

export const metadata: Metadata = {
  title: "Signup",
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
    ? { title: "Sign up", subtitle: "Create your space and start structuring your specifications." }
    : {
        title: "Créer un compte",
        subtitle: "Crée ton espace et commence à structurer tes spécifications.",
      }

  return (
    <div className="flex w-full min-h-[calc(100dvh-56px)] items-center justify-center overflow-y-auto px-4 py-8">
      <div className="w-full max-w-2xl">
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

        <SignupForm />

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {locale === "en" ? "Already have an account?" : "Déjà un compte ?"}{" "}
          <Link
            className="underline underline-offset-4"
            href={`/${locale}/login`}
          >
            {locale === "en" ? "Sign in" : "Se connecter"}
          </Link>
        </div>
      </div>
    </div>
  )
}
