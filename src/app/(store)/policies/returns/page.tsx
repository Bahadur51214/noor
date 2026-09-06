import { settingsService } from "@/services/settings.service";

export const metadata = {
  title: "Return & Refund Policy | NOOR Watches",
  description:
    "Read NOOR's 7-day return and refund policy — how to start a return for your watch order and what to expect.",
};

export default async function ReturnPolicyPage() {
  const policy = await settingsService.getByGroup("policy");
  const content = policy.returnPolicy || "";

  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      <section className="bg-[#0D0D0D] text-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-serif">Return &amp; Refund Policy</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-xl border border-[#E0DCD5] p-6 md:p-10 text-gray-700 text-sm leading-relaxed">
            {content ? (
              <p className="whitespace-pre-line">{content}</p>
            ) : (
              <div className="space-y-6">
                <h2 className="text-lg font-serif text-[#0D0D0D]">Return Window</h2>
                <p>We accept returns within <strong>7 days</strong> of delivery. The product must be unused, in its original packaging, and in the same condition as received.</p>

                <h2 className="text-lg font-serif text-[#0D0D0D]">How to Initiate a Return</h2>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Contact us via WhatsApp or email with your order number.</li>
                  <li>Provide a brief reason for the return.</li>
                  <li>Our team will provide return shipping instructions within 24 hours.</li>
                </ol>

                <h2 className="text-lg font-serif text-[#0D0D0D]">Refund Process</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>COD orders:</strong> Refund will be transferred to your bank account or EasyPaisa/JazzCash within 3-5 business days after the returned item is received and inspected.</li>
                  <li><strong>Advance payment orders:</strong> Refund will be returned to the original payment method within 3-5 business days.</li>
                </ul>

                <h2 className="text-lg font-serif text-[#0D0D0D]">Non-Returnable Items</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Items that have been worn, damaged, or altered after delivery.</li>
                  <li>Items without original packaging or tags.</li>
                  <li>Sale or clearance items (unless defective).</li>
                </ul>

                <h2 className="text-lg font-serif text-[#0D0D0D]">Defective Products</h2>
                <p>If you receive a defective or damaged product, please contact us within <strong>48 hours</strong> of delivery with photos. We will arrange a free replacement or full refund immediately.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
