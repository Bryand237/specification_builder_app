import Link from "next/link"
import Image from "next/image"
import { ObjectId } from "mongodb"

import { auth } from "@/auth"
import type { Locale } from "@/lib/i18n"
import { getDictionary } from "@/lib/i18n"
import { getMongoClientPromise } from "@/lib/db/mongodb"
import { ThemeToggle } from "@/components/theme-toggle"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { Button } from "@/components/ui/button"
import HeaderUser from "@/components/home/header-user"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

type UserDoc = {
  _id: ObjectId
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  username?: string
  createdAt?: Date
}

export async function SiteHeader({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale)
  const session = await auth()

  let userProfile: {
    firstName?: string | null
    lastName?: string | null
    email?: string | null
    phone?: string | null
    username?: string | null
    createdAt?: string | null
    name?: string | null
  } | null = null

  if (session?.user?.id) {
    const client = await getMongoClientPromise()
    const db = client.db()
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(session.user.id) })

    const u = user as UserDoc | null
    if (u) {
      userProfile = {
        firstName: u.firstName ?? null,
        lastName: u.lastName ?? null,
        email: u.email ?? session.user.email ?? null,
        phone: u.phone ?? null,
        username: u.username ?? null,
        createdAt: u.createdAt
          ? u.createdAt.toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : null,
        name: session.user.name ?? null,
      }
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 font-semibold tracking-tight"
          aria-label="Specifications Builder"
        >
          <Image
            src="/SB_logo.png"
            alt="Specifications Builder"
            width={36}
            height={36}
            priority
            className="h-9 w-9 object-contain"
          />
        </Link>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href={`/${locale}`}>{dict.nav.home}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href={`/${locale}/help`}>{dict.nav.help}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href={`/${locale}/about`}>{dict.nav.about}</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <LocaleSwitcher locale={locale} />
          <ThemeToggle />
          {session?.user?.id && userProfile ? (
            <HeaderUser locale={locale} user={userProfile} />
          ) : (
            <>
              <Button asChild>
                <Link href={`/${locale}/login`}>{dict.auth.login}</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/${locale}/signup`}>{dict.auth.signup}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
