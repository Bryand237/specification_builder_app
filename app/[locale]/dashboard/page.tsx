import { redirect } from "next/navigation"

import { auth } from "@/auth"

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) {
    const { locale } = await params
    redirect(`/${locale}/login`)
  }

  const { locale } = await params
  return redirect(`/${locale}/dashboard/overview`)
}
