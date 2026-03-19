"use client"

import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function HeaderItems() {
  const pathname = usePathname()
  const navItems = [
    {
      name: "Accueil",
      url: "/",
    },
    {
      name: "About",
      url: "/about",
    },
    {
      name: "Aide",
      url: "/help",
    },
  ]
  return (
    <nav className="p-4">
      <ul className="flex list-none gap-6">
        {navItems.map((item, index) => (
          <li key={index}>
            <Link
              className={clsx("font-medium hover:underline hover:opacity-80", {
                "text-blue-300 underline": pathname === item.url,
              })}
              href={item.url}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
