import HeaderActions from "./header-actions"
import HeaderItems from "./header-items"
import HeaderLogo from "./header-logo"
import HeaderUser from "./header-user"

export default function HeaderNav() {
  return (
    <header className="flex max-h-16 min-w-full items-center justify-between p-6 shadow">
      <HeaderLogo />
      <HeaderItems />
      <HeaderActions />
      {/* <HeaderUser /> */}
    </header>
  )
}
