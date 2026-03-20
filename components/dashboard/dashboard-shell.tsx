import { ReactNode } from "react"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Menu } from "lucide-react"

export function DashboardShell({
  sidebar,
  children,
  title,
}: {
  sidebar: ReactNode
  children: ReactNode
  title: string
}) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden" aria-label="Menu">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            {sidebar}
          </SheetContent>
        </Sheet>
      </div>
      <Separator className="my-6" />
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <aside className="hidden md:block">{sidebar}</aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  )
}
