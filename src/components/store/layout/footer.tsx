import Link from "next/link";
import { settingsService } from "@/services/settings.service";

export default async function Footer() {
  const store = await settingsService.getByGroup("store");
  const social = await settingsService.getByGroup("social");
  const contactPhone = store.phone || "";
  const contactEmail = store.email || "";

  return (
    <footer className="bg-[#0D0D0D] text-[#F7F4EF] py-12">
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <h3 className="font-serif text-2xl tracking-widest mb-4">NOOR</h3>
          <p className="text-sm text-gray-400 max-w-xs">
            Elegance redefined. Premium women&apos;s watches in Pakistan designed for the modern woman.
          </p>
          {(contactPhone || contactEmail) && (
            <div className="mt-4 space-y-1 text-sm text-gray-400">
              {contactPhone && <p>{contactPhone}</p>}
              {contactEmail && <p>{contactEmail}</p>}
            </div>
          )}
          {(social.instagram || social.facebook || social.tiktok || social.youtube) && (
            <div className="mt-4 flex gap-3 text-sm text-gray-400">
              {social.instagram && <Link href={social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</Link>}
              {social.facebook && <Link href={social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</Link>}
              {social.tiktok && <Link href={social.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TikTok</Link>}
              {social.youtube && <Link href={social.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">YouTube</Link>}
            </div>
          )}
        </div>
        
        <div>
          <h4 className="font-medium mb-4 text-lg">Shop</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/shop" className="hover:text-white transition-colors">All Watches</Link></li>
            <li><Link href="/shop?featured=true" className="hover:text-white transition-colors">New Arrivals</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About NOOR</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-4 text-lg">Support</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            <li><Link href="/track-order" className="hover:text-white transition-colors">Track Order</Link></li>
            <li><Link href="/policies/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
            <li><Link href="/policies/returns" className="hover:text-white transition-colors">Return Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-4 text-lg">Legal</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/policies/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/policies/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-sm text-center text-gray-500">
        &copy; {new Date().getFullYear()} NOOR Watches. All rights reserved.
      </div>
    </footer>
  );
}
