import Image from "next/image"

export default function HeaderLogo() {
  return (
    <div>
      <Image
        alt="Logo"
        src={"/SB_logo.png"}
        width={50}
        height={50}
        className="block rounded-full"
      />
    </div>
  )
}
