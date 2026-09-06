import { settingsService } from "@/services/settings.service";

export const metadata = {
  title: "Shipping Policy | NOOR Watches",
  description:
    "Learn about NOOR's delivery coverage across Pakistan, delivery charges, processing times, and how to track your order.",
  alternates: { canonical: "/policies/shipping" },
};

export default async function ShippingPolicyPage() {
  const policy = await settingsService.getByGroup("policy");
  const content = policy.shippingPolicy || "";

  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      <section className="bg-[#0D0D0D] text-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-serif">Shipping Policy</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-xl border border-[#E0DCD5] p-6 md:p-10 text-gray-700 text-sm leading-relaxed">
            {content ? (
              <p className="whitespace-pre-line">{content}</p>
            ) : (
              <div className="space-y-6">
                <h2 className="text-lg font-serif text-[#0D0D0D]">Delivery Coverage</h2>
                <p>We deliver to all major cities and towns across Pakistan including Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, Sialkot, Gujranwala, and more.</p>

                <h2 className="text-lg font-serif text-[#0D0D0D]">Delivery Charges</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Cash on Delivery (COD):</strong> Standard delivery fee applies (typically Rs. 200 - Rs. 300 depending on location).</li>
                  <li><strong>Advance Payment:</strong> Enjoy <strong>FREE delivery</strong> when you pay in advance via bank transfer, EasyPaisa, or JazzCash.</li>
                </ul>

                <h2 className="text-lg font-serif text-[#0D0D0D]">Processing &amp; Delivery Time</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Orders are processed within <strong>1-2 business days</strong>.</li>
                  <li>Standard delivery takes <strong>3-5 business days</strong> for major cities.</li>
                  <li>Remote areas may take <strong>5-7 business days</strong>.</li>
                </ul>

                <h2 className="text-lg font-serif text-[#0D0D0D]">Order Tracking</h2>
                <p>Once your order is shipped, you will receive a tracking number via SMS or WhatsApp. You can also track your order on our website using the <strong>Track Order</strong> page.</p>

                <h2 className="text-lg font-serif text-[#0D0D0D]">Packaging</h2>
                <p>All NOOR watches are shipped in premium branded packaging with protective cushioning to ensure your timepiece arrives in perfect condition.</p>
              </div>
            )}
          </div>
          {content && (
            <p className="text-xs text-gray-400 mt-4">Policy managed by NOOR admin. Last updated from dashboard settings.</p>
          )}
        </div>
      </section>
    </div>
  );
}
