import { settingsService } from "@/services/settings.service";

export const metadata = {
  title: "Terms & Conditions | NOOR Watches",
  description:
    "Read the terms and conditions that apply when you use NOOR's website, place an order, and shop with us online.",
  alternates: { canonical: "/policies/terms" },
};

export default async function TermsPage() {
  const policy = await settingsService.getByGroup("policy");
  const content = policy.terms || "";

  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      <section className="bg-[#0D0D0D] text-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-serif">Terms &amp; Conditions</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-xl border border-[#E0DCD5] p-6 md:p-10 space-y-6 text-gray-700 text-sm leading-relaxed">
            {content ? (
              <p className="whitespace-pre-line">{content}</p>
            ) : (
              <>
                <h2 className="text-lg font-serif text-[#0D0D0D]">General</h2>
                <p>By accessing and placing an order on noorwatches.com, you confirm that you are in agreement with and bound by the terms and conditions below. These terms apply to the entire website and any communication between you and NOOR.</p>

                <h2 className="text-lg font-serif text-[#0D0D0D]">Products &amp; Pricing</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All prices are listed in Pakistani Rupees (PKR) and include applicable taxes.</li>
                  <li>We reserve the right to modify prices at any time without prior notice.</li>
                  <li>Product images are representative. Minor variations in color may occur due to screen settings.</li>
                </ul>

                <h2 className="text-lg font-serif text-[#0D0D0D]">Orders</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>By placing an order, you confirm that the information provided is accurate and complete.</li>
                  <li>We reserve the right to cancel orders if fraud or abuse is suspected.</li>
                  <li>An order confirmation does not guarantee product availability. In rare cases of stock issues, we will notify you and offer a full refund.</li>
                </ul>

                <h2 className="text-lg font-serif text-[#0D0D0D]">Payment</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We accept Cash on Delivery (COD), Bank Transfer, EasyPaisa, and JazzCash.</li>
                  <li>Advance payment orders require a valid payment reference or screenshot for verification before dispatch.</li>
                  <li>Fraudulent payment references will result in order cancellation and may be reported.</li>
                </ul>

                <h2 className="text-lg font-serif text-[#0D0D0D]">Intellectual Property</h2>
                <p>All content on this website — including text, images, logos, and designs — is the property of NOOR and may not be reproduced or used without explicit written permission.</p>

                <h2 className="text-lg font-serif text-[#0D0D0D]">Limitation of Liability</h2>
                <p>NOOR shall not be held liable for any delays caused by courier services, natural disasters, or other events beyond our control. Our maximum liability is limited to the value of the purchased product.</p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
