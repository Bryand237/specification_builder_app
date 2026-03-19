import { Button } from "@/components/ui/button"
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

export default function HeaderUser() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">User</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>User Profile</SheetTitle>
          <SheetDescription>View your profile Infos</SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <p className="text-sm">Name</p>
            <h3 className="font-mono text-xl">Delta</h3>
          </div>
          <div className="grid gap-3">
            <p className="text-sm">Surname</p>
            <h3 className="font-mono text-xl">Tensai</h3>
          </div>
          <div className="grid gap-3">
            <p className="text-sm">Email</p>
            <h3 className="font-mono text-xl">deltes6@gmail.com</h3>
          </div>
          <div className="grid gap-3">
            <p className="text-sm">Phone</p>
            <h3 className="font-mono text-xl">+237 6 58 23 28 06</h3>
          </div>
          <div className="grid gap-3">
            <p className="text-sm">Date d'enregistrement</p>
            <h3 className="font-mono text-xl">19 Mars 2026</h3>
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Modify profile</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
