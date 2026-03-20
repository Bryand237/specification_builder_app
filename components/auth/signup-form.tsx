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
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type ApiError = {
  error?: {
    code?: string
  }
}

export function SignupForm() {
  const router = useRouter()
  const locale = useLocale()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const ui =
    locale === "en"
      ? {
          firstNameLabel: "First name",
          lastNameLabel: "Last name",
          emailLabel: "Email",
          phoneLabel: "Phone",
          usernameLabel: "Username",
          passwordLabel: "Password",
          confirmPasswordLabel: "Confirm password",
          acceptLegendPrefix: "By creating an account, you agree to our",
          terms: "terms",
          privacy: "privacy policy",
          firstNameDesc: "Your first name.",
          lastNameDesc: "Your last name.",
          emailDesc: "Used to sign in to your account.",
          phoneDesc: "Optional for your usage, but required here.",
          usernameDesc: "Visible in the app.",
          passwordDesc: "Minimum 8 characters.",
          submit: "Create account",
          submitting: "Creating...",
          userExists: "User already exists",
          unableCreate: "Unable to create account",
          policyConnector: ".",
        }
      : {
          firstNameLabel: "Prénom",
          lastNameLabel: "Nom",
          emailLabel: "Email",
          phoneLabel: "Téléphone",
          usernameLabel: "Nom d'utilisateur",
          passwordLabel: "Mot de passe",
          confirmPasswordLabel: "Confirmer le mot de passe",
          acceptLegendPrefix: "En créant un compte, vous acceptez nos",
          terms: "conditions",
          privacy: "politique de confidentialité",
          firstNameDesc: "Votre prénom.",
          lastNameDesc: "Votre nom.",
          emailDesc: "Utilisé pour vous connecter.",
          phoneDesc: "Optionnel selon ton usage, mais requis ici.",
          usernameDesc: "Visible dans l'application.",
          passwordDesc: "Minimum 8 caractères.",
          submit: "Créer mon compte",
          submitting: "Création...",
          userExists: "Cet utilisateur existe déjà",
          unableCreate: "Impossible de créer le compte",
          policyConnector: ".",
        }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        phone,
        username,
        password,
        confirmPassword,
      }),
    })

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as ApiError
      if (res.status === 409 || body?.error?.code === "USER_ALREADY_EXISTS") {
        setError(ui.userExists)
      } else {
        setError(ui.unableCreate)
      }
      setLoading(false)
      return
    }

    const loginRes = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (loginRes?.error) {
      router.push(`/${locale}/login`)
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
        <div className="grid max-h-[calc(100dvh-320px)] grid-cols-1 gap-5 overflow-auto md:grid-cols-2">
          <Field className="md:col-span-1">
            <FieldLabel htmlFor="firstname">{ui.firstNameLabel}</FieldLabel>
            <Input
              id="firstname"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={locale === "en" ? "e.g. Max" : "Ex: Max"}
              required
              autoComplete="given-name"
            />
            <FieldDescription>{ui.firstNameDesc}</FieldDescription>
          </Field>

          <Field className="md:col-span-1">
            <FieldLabel htmlFor="lastname">{ui.lastNameLabel}</FieldLabel>
            <Input
              id="lastname"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={locale === "en" ? "e.g. Leiter" : "Ex: Leiter"}
              required
              autoComplete="family-name"
            />
            <FieldDescription>{ui.lastNameDesc}</FieldDescription>
          </Field>

          <Field className="md:col-span-1">
            <FieldLabel htmlFor="email">{ui.emailLabel}</FieldLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
              autoComplete="email"
            />
            <FieldDescription>{ui.emailDesc}</FieldDescription>
          </Field>

          <Field className="md:col-span-1">
            <FieldLabel htmlFor="phone">{ui.phoneLabel}</FieldLabel>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={locale === "en" ? "+1..." : "+237..."}
              required
              autoComplete="tel"
            />
            <FieldDescription>{ui.phoneDesc}</FieldDescription>
          </Field>

          <Field className="md:col-span-1">
            <FieldLabel htmlFor="username">{ui.usernameLabel}</FieldLabel>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={locale === "en" ? "e.g. max205" : "Ex: max205"}
              required
              autoComplete="username"
            />
            <FieldDescription>{ui.usernameDesc}</FieldDescription>
          </Field>

          <Field className="md:col-span-1">
            <FieldLabel htmlFor="password">{ui.passwordLabel}</FieldLabel>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
            <FieldDescription>{ui.passwordDesc}</FieldDescription>
          </Field>

          <Field className="md:col-span-1">
            <FieldLabel htmlFor="cpassword">{ui.confirmPasswordLabel}</FieldLabel>
            <Input
              id="cpassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
          </Field>

          <div className="md:col-span-2">
            <FieldDescription>
              {ui.acceptLegendPrefix}{" "}
              <Link className="underline underline-offset-4" href="#">
                {ui.terms}
              </Link>{" "}
              {locale === "en" ? "and our" : "et notre"}{" "}
              <Link className="underline underline-offset-4" href="#">
                {ui.privacy}
              </Link>
              {ui.policyConnector}
            </FieldDescription>
          </div>
        </div>

        <FieldError>{error}</FieldError>
      </FieldSet>

      <Button type="submit" size="lg" disabled={loading}>
        {loading ? ui.submitting : ui.submit}
      </Button>
    </form>
  )
}
