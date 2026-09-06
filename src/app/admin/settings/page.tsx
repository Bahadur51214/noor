import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettingsForm } from "@/components/admin/settings/general-settings-form";
import { ShippingSettingsForm } from "@/components/admin/settings/shipping-settings-form";
import { PaymentSettingsForm } from "@/components/admin/settings/payment-settings-form";
import { AccountSettingsForm } from "@/components/admin/settings/account-settings-form";
import { SettingsForm } from "@/components/admin/settings/settings-form";
import { settingsService } from "@/services/settings.service";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function SettingsPage() {
  const session = await requireAuth();

  const [generalData, shippingData, paymentData] = await Promise.all([
    settingsService.getByGroup("store"),
    settingsService.getByGroup("shipping"),
    settingsService.getByGroup("payment"),
  ]);

  const admin = await db.adminUser.findUnique({
    where: { id: session.adminId },
    select: { email: true },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 font-serif text-[#0D0D0D]">Settings</h1>
      <Tabs defaultValue="general">
        <TabsList className="mb-4 bg-[#F7F4EF]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <div className="max-w-xl p-4 bg-white rounded-md border border-gray-100 shadow-sm">
            <GeneralSettingsForm settings={generalData} />
          </div>
        </TabsContent>
        <TabsContent value="shipping">
          <div className="max-w-xl p-4 bg-white rounded-md border border-gray-100 shadow-sm">
            <ShippingSettingsForm settings={shippingData} />
          </div>
        </TabsContent>
        <TabsContent value="payments">
          <div className="max-w-xl p-4 bg-white rounded-md border border-gray-100 shadow-sm">
            <PaymentSettingsForm initialData={paymentData} />
          </div>
        </TabsContent>
        <TabsContent value="homepage">
          <div className="max-w-xl p-4 bg-white rounded-md border border-gray-100 shadow-sm">
            <SettingsForm
              title="Homepage Settings"
              description="Configure announcement bar, hero section, and homepage content."
              group="homepage"
              fields={[
                { key: "announcementBar", label: "Announcement Bar", type: "text", placeholder: "e.g. Free delivery on advance payment" },
                { key: "heroTitle", label: "Hero Title", type: "text", placeholder: "TIME, MADE BEAUTIFUL." },
                { key: "heroSubtitle", label: "Hero Subtitle", type: "text", placeholder: "Premium women's watches" },
                { key: "heroCta", label: "Hero CTA Text", type: "text", placeholder: "SHOP WATCHES" },
                { key: "heroImage", label: "Hero Image URL", type: "text", placeholder: "https://..." },
              ]}
            />
          </div>
        </TabsContent>
        <TabsContent value="social">
          <div className="max-w-xl p-4 bg-white rounded-md border border-gray-100 shadow-sm">
            <SettingsForm
              title="Social Media Links"
              description="Configure your social media profile URLs."
              group="social"
              fields={[
                { key: "instagram", label: "Instagram URL", type: "text", placeholder: "https://instagram.com/noor" },
                { key: "facebook", label: "Facebook URL", type: "text", placeholder: "https://facebook.com/noor" },
                { key: "tiktok", label: "TikTok URL", type: "text", placeholder: "https://tiktok.com/@noor" },
                { key: "youtube", label: "YouTube URL", type: "text", placeholder: "https://youtube.com/@noor" },
              ]}
            />
          </div>
        </TabsContent>
        <TabsContent value="policies">
          <div className="max-w-xl p-4 bg-white rounded-md border border-gray-100 shadow-sm">
            <SettingsForm
              title="Policy Content"
              description="Edit your privacy, returns, shipping, and terms policy content."
              group="policy"
              fields={[
                { key: "shippingPolicy", label: "Shipping Policy", type: "textarea", placeholder: "Shipping policy content..." },
                { key: "returnPolicy", label: "Return Policy", type: "textarea", placeholder: "Return policy content..." },
                { key: "privacyPolicy", label: "Privacy Policy", type: "textarea", placeholder: "Privacy policy content..." },
                { key: "terms", label: "Terms of Service", type: "textarea", placeholder: "Terms content..." },
              ]}
            />
          </div>
        </TabsContent>
        <TabsContent value="account">
          <div className="max-w-xl p-4 bg-white rounded-md border border-gray-100 shadow-sm">
            <AccountSettingsForm email={admin?.email || ""} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
