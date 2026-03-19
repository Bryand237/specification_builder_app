import Link from "next/link"
import { Button } from "../ui/button"

export default function HeaderActions() {
  return (
    <div className="flex gap-2 p-4">
      <Link
        href={"/login"}
        className="rounded-sm bg-blue-500 px-2.5 py-1.5 text-blue-50"
      >
        Login
      </Link>
      <Link
        href={"/signup"}
        className="rounded-sm border-2 border-blue-500 bg-transparent px-2.5 py-1.5 text-blue-500 hover:bg-blue-500 hover:text-white"
      >
        Signup
      </Link>
    </div>
  )
}
