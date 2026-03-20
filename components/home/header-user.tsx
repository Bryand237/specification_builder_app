"use client"

import Link from "next/link"
import { signOut } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type HeaderUserProps = {
  locale: string
  user: {
    name?: string | null
    firstName?: string | null
    lastName?: string | null
    email?: string | null
    phone?: string | null
    username?: string | null
    createdAt?: string | null
  }
}

export default function HeaderUser({ locale, user }: HeaderUserProps) {
  const displayName =
    user.name ||
    `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
    user.username ||
    "Utilisateur"

  const ui =
    locale === "en"
      ? {
          sheetTitle: "Profile",
          sheetDescription: "Your account information.",
          lastNameLabel: "Last name",
          firstNameLabel: "First name",
          emailLabel: "Email",
          phoneLabel: "Phone",
          createdAtLabel: "Registration date",
          dashboard: "Dashboard",
          signOut: "Sign out",
          close: "Close",
        }
      : {
          sheetTitle: "Profil",
          sheetDescription: "Informations de votre compte.",
          lastNameLabel: "Nom",
          firstNameLabel: "Prénom",
          emailLabel: "Email",
          phoneLabel: "Phone",
          createdAtLabel: "Date d'enregistrement",
          dashboard: "Tableau de bord",
          signOut: "Se déconnecter",
          close: "Fermer",
        }

  const initials = displayName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("")
    .slice(0, 2)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Avatar size="sm" className="border bg-muted">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt={`Avatar de ${displayName}`}
            />
            <AvatarFallback>{initials || "SB"}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-32 truncate sm:inline">
            {displayName}
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{ui.sheetTitle}</SheetTitle>
          <SheetDescription>{ui.sheetDescription}</SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <p className="text-sm">{ui.lastNameLabel}</p>
            <h3 className="font-mono text-xl">{user.lastName || "-"}</h3>
          </div>
          <div className="grid gap-3">
            <p className="text-sm">{ui.firstNameLabel}</p>
            <h3 className="font-mono text-xl">{user.firstName || "-"}</h3>
          </div>
          <div className="grid gap-3">
            <p className="text-sm">{ui.emailLabel}</p>
            <h3 className="font-mono text-xl">{user.email || "-"}</h3>
          </div>
          <div className="grid gap-3">
            <p className="text-sm">{ui.phoneLabel}</p>
            <h3 className="font-mono text-xl">{user.phone || "-"}</h3>
          </div>
          <div className="grid gap-3">
            <p className="text-sm">{ui.createdAtLabel}</p>
            <h3 className="font-mono text-xl">{user.createdAt || "-"}</h3>
          </div>
        </div>
        <SheetFooter>
          <Button asChild>
            <Link href={`/${locale}/dashboard`}>{ui.dashboard}</Link>
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              void signOut({ callbackUrl: `/${locale}` })
            }}
          >
            {ui.signOut}
          </Button>
          <SheetClose asChild>
            <Button variant="outline">{ui.close}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
