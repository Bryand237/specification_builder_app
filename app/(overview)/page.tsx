import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

export default function Home() {
  return (
    <main className="">
      <section className="relative h-[calc(100vh-64px)] w-[calc(100vw)] overflow-hidden">
        <Image
          alt="home specifications image"
          src={"/sb-bg.png"}
          width={1536}
          height={1024}
          className="absolute flex min-w-full object-cover"
        />
        <div className="absolute ms-[10%] mt-[12%] w-[calc(100vw/3)]">
          <h1 className="mb-4 font-mono text-6xl font-semibold text-blue-400">
            Specifications Builder
          </h1>

          <p className="mb-16 font-sans text-xl text-white">
            L&apos;analyse d&apos;un projet n&apos;a jamais ete aussi simple.
            Venez suivre les etapes de l&apos;analyse d&apos;un projet et
            concevoir le cahier des charges correspondant.
          </p>

          <div className="cta">
            <Link
              href={"/signup"}
              className="rounded-xl bg-blue-500 px-3 py-4 text-lg text-white hover:bg-blue-600"
            >
              Commencer maintenant
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
