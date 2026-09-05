"use client";

import { useEffect, useState } from "react";
import { getPublicStoreSettings } from "@/actions/public.actions";
import { toWhatsAppLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/store/whatsapp-icon";

export function WhatsAppButton() {
  const [href, setHref] = useState("");

  useEffect(() => {
    getPublicStoreSettings().then((settings) => {
      const number = settings.whatsapp || settings.phone;
      if (number) {
        setHref(toWhatsAppLink(number, "Hi NOOR! I have a question about your watches."));
      }
    });
  }, []);

  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 transition-transform hover:scale-110"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}