"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { signIn } from "next-auth/react"

import { useLocale } from "@/hooks/use-locale"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function LoginForm() {
  const router = useRouter()
  const locale = useLocale()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const ui =
    locale === "en"
      ? {
          emailLabel: "Email",
          passwordLabel: "Password",
          forgotPassword: "Forgot password?",
          submit: "Sign in",
          submitting: "Signing in...",
          forgotLinkHref: "#",
          invalid: "Invalid credentials",
        }
      : {
          emailLabel: "Email",
          passwordLabel: "Mot de passe",
          forgotPassword: "Mot de passe oublié ?",
          submit: "Se connecter",
          submitting: "Connexion...",
          forgotLinkHref: "#",
          invalid: "Identifiants invalides",
        }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError(ui.invalid)
      setLoading(false)
      return
    }

    router.push(`/${locale}/dashboard`)
  }

  return (
    <form
      className="flex w-full flex-col gap-6 rounded-2xl border bg-card p-6 shadow-sm"
      onSubmit={onSubmit}
    >
      <FieldSet className="w-full">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
              autoComplete="email"
            />
            <FieldDescription>
              Entrez l&apos;email associé à votre compte.
            </FieldDescription>
          </Field>

          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">{ui.passwordLabel}</FieldLabel>
              <Link className="text-sm underline underline-offset-4" href={ui.forgotLinkHref}>
                {ui.forgotPassword}
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </Field>
        </FieldGroup>

        <FieldError>{error}</FieldError>
      </FieldSet>

      <Button type="submit" size="lg" disabled={loading}>
        {loading ? ui.submitting : ui.submit}
      </Button>
    </form>
  )
}
