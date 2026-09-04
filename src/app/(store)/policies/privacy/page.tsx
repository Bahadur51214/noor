import { settingsService } from "@/services/settings.service";

export const metadata = {
  title: "Privacy Policy | NOOR Watches",
};

export default async function PrivacyPolicyPage() {
  const policy = await settingsService.getByGroup("policy");
  const content = policy.privacyPolicy || "";

  return (
    <div className="min-h-screen bg-[#F7F4EF]">
      <section className="bg-[#0D0D0D] text-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-serif">Privacy Policy</h1>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-xl border border-[#E0DCD5] p-6 md:p-10 space-y-6 text-gray-700 text-sm leading-relaxed">
            {content ? (
              <p className="whitespace-pre-line">{content}</p>
            ) : (
              <>
                <h2 className="text-lg font-serif text-[#0D0D0D]">Information We Collect</h2>
                <p>When you place an order on NOOR, we collect the following information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Full name and phone number</li>
                  <li>Email address (if provided)</li>
                  <li>Delivery address (city, area, full address, landmark)</li>
                  <li>Payment method and transaction details</li>
                </ul>

                <h2 className="text-lg font-serif text-[#0D0D0D]">How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>To process and deliver your orders</li>
                  <li>To communicate with you about your order status</li>
                  <li>To send promotional offers (only with your consent)</li>
                  <li>To improve our products and services</li>
                </ul>

                <h2 className="text-lg font-serif text-[#0D0D0D]">Data Security</h2>
                <p>We implement industry-standard security measures to protect your personal information. Your data is stored securely and is never sold or shared with third parties for marketing purposes.</p>

                <h2 className="text-lg font-serif text-[#0D0D0D]">Third-Party Services</h2>
                <p>We may share your delivery information with our courier partners solely for the purpose of delivering your order. Payment screenshot uploads are stored securely on Cloudinary.</p>

                <h2 className="text-lg font-serif text-[#0D0D0D]">Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Request access to the personal data we hold about you</li>
                  <li>Request correction or deletion of your data</li>
                  <li>Opt out of promotional communications at any time</li>
                </ul>

                <h2 className="text-lg font-serif text-[#0D0D0D]">Contact Us</h2>
                <p>For any privacy-related concerns, please contact us at <strong>support@noorwatches.pk</strong> or via WhatsApp.</p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
