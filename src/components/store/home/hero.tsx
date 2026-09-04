"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "motion/react"
import Link from "next/link"
import Image from "next/image"
import { getPublicStoreSettings } from "@/actions/public.actions"

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=2000&auto=format&fit=crop"

export function Hero() {
  const [title, setTitle] = useState("TIME, MADE BEAUTIFUL.")
  const [subtitle, setSubtitle] = useState("")
  const [cta, setCta] = useState("SHOP WATCHES")
  const [image, setImage] = useState(FALLBACK_IMAGE)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    getPublicStoreSettings().then((settings) => {
      if (settings.hero.title) setTitle(settings.hero.title)
      if (settings.hero.subtitle) setSubtitle(settings.hero.subtitle)
      if (settings.hero.cta) setCta(settings.hero.cta)
      if (settings.hero.image) setImage(settings.hero.image)
      setReady(true)
    })
  }, [])

  return (
    <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden bg-[#0D0D0D] flex items-center justify-center">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={image}
          alt="Luxury Watch"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/90 via-[#0D0D0D]/40 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto mt-16">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-[#C9A96E] uppercase tracking-[0.3em] text-sm font-medium mb-6 block"
        >
          Noor Exclusive
        </motion.span>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-serif text-white mb-8 tracking-wide leading-tight"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl"
          >
            {subtitle}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <Button asChild size="lg" className="bg-[#C9A96E] hover:bg-[#b0925c] text-white px-10 py-6 text-base tracking-widest uppercase transition-all duration-300 rounded-none">
            <Link href="/shop">{cta}</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
