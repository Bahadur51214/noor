"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { getPublicStoreSettings } from "@/actions/public.actions"

export const DEFAULT_HERO_IMAGE = "https://res.cloudinary.com/tlbuabtl/image/upload/v1788517715/ChatGPT_Image_Sep_4_2026_03_02_23_PM.png"

interface HeroProps {
  initialImage?: string
}

export function Hero({ initialImage }: HeroProps) {
  const [image, setImage] = useState(initialImage || DEFAULT_HERO_IMAGE)

  useEffect(() => {
    getPublicStoreSettings().then((settings) => {
      if (settings.hero.image) setImage(settings.hero.image)
    })
  }, [])

  return (
    <section className="relative w-full aspect-[16/9] overflow-hidden bg-[#0D0D0D]">
      <Link href="/shop" className="block relative w-full h-full cursor-pointer">
        <Image
          src={image}
          alt="NOOR Watches"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </Link>
    </section>
  )
}
