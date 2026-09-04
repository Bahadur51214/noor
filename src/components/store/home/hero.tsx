"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { getPublicStoreSettings } from "@/actions/public.actions"

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=2000&auto=format&fit=crop"

export function Hero() {
  const [image, setImage] = useState(FALLBACK_IMAGE)

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
