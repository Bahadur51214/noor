import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { settingsService } from "@/services/settings.service";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  ),
};

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  tiktok: "TikTok",
  youtube: "YouTube",
};

const SOCIAL_HOVER: Record<string, string> = {
  instagram: "hover:bg-[#E4405F]",
  facebook: "hover:bg-[#1877F2]",
  tiktok: "hover:bg-black",
  youtube: "hover:bg-[#FF0000]",
};

export default async function Footer() {
  const store = await settingsService.getByGroup("store");
  const social = await settingsService.getByGroup("social");
  const contactPhone = store.phone || "";
  const contactEmail = store.email || "";

  const socials = (["instagram", "facebook", "tiktok", "youtube"] as const)
    .filter((key) => social[key])
    .map((key) => ({ key, href: social[key] as string }));

  return (
    <footer className="bg-[#0D0D0D] text-[#F7F4EF]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          <div className="lg:w-[40%]">
            <h3 className="font-serif text-2xl tracking-widest">NOOR</h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
              Elegance redefined. Premium women&apos;s watches in Pakistan
              designed for the modern woman.
            </p>

            {(contactPhone || contactEmail) && (
              <div className="mt-6 space-y-2 text-sm text-gray-400">
                {contactPhone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#C9A96E]" aria-hidden="true" />
                    <span dir="ltr">{contactPhone}</span>
                  </p>
                )}
                {contactEmail && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#C9A96E]" aria-hidden="true" />
                    <span>{contactEmail}</span>
                  </p>
                )}
              </div>
            )}

            {socials.length > 0 && (
              <div className="mt-6 flex items-center gap-3">
                {socials.map(({ key, href }) => (
                  <Link
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${SOCIAL_LABELS[key]}`}
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-300 transition-all hover:-translate-y-0.5 hover:text-white ${SOCIAL_HOVER[key]}`}
                  >
                    <span className="h-5 w-5">{SOCIAL_ICONS[key]}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <nav className="grid flex-1 grid-cols-3 gap-6 sm:gap-8" aria-label="Footer">
            <div>
              <h4 className="mb-4 text-lg font-medium">Shop</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li>
                  <Link href="/shop" className="transition-colors hover:text-[#C9A96E]">
                    All Watches
                  </Link>
                </li>
                <li>
                  <Link href="/shop?featured=true" className="transition-colors hover:text-[#C9A96E]">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="transition-colors hover:text-[#C9A96E]">
                    About NOOR
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-medium">Support</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li>
                  <Link href="/contact" className="transition-colors hover:text-[#C9A96E]">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/track-order" className="transition-colors hover:text-[#C9A96E]">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link href="/policies/shipping" className="transition-colors hover:text-[#C9A96E]">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link href="/policies/returns" className="transition-colors hover:text-[#C9A96E]">
                    Return Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 text-lg font-medium">Legal</h4>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li>
                  <Link href="/policies/privacy" className="transition-colors hover:text-[#C9A96E]">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/policies/terms" className="transition-colors hover:text-[#C9A96E]">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-12 flex flex-col items-center gap-2 border-t border-gray-800 pt-8 text-center text-sm text-gray-500 sm:flex-row sm:justify-between">
          <p>&copy; {new Date().getFullYear()} NOOR Watches. All rights reserved.</p>
          <p>
            Made with <span className="text-[#C9A96E]">&#9829;</span> in Pakistan
          </p>
        </div>
      </div>
    </footer>
  );
}