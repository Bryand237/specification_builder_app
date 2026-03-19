import HeaderNav from "@/components/home/header-nav"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen">
      <div className="w-full flex-none">
        <HeaderNav />
      </div>
      <div className="h-[calc(100vh-64px)] w-full">{children}</div>
    </div>
  )
}
