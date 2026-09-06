import { PrismaClient, AdminRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  // ---- Initial Admin User ----
  // Login at /admin/login. Credentials are hashed via bcrypt (never plain text).
  const adminEmail = "admin@noorwatches.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Alikhan@786";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await db.adminUser.upsert({
    where: { email: adminEmail },
    update: { name: "Super Admin", role: AdminRole.SUPER_ADMIN, active: true },
    create: {
      email: adminEmail,
      name: "Super Admin",
      passwordHash,
      role: AdminRole.SUPER_ADMIN,
      active: true,
    },
  });
  console.log(`✔ Admin user ready: ${adminEmail}`);

  // ---- Essential Store Settings ----
  // Delivery fee keys are read directly by the order service at checkout.
  const settings: Array<{ key: string; value: string; group: string }> = [
    // shipping
    { key: "cod_delivery_fee", value: "250", group: "shipping" },
    { key: "advance_delivery_fee", value: "150", group: "shipping" },
    { key: "free_shipping_min_order", value: "5000", group: "shipping" },
    // store
    { key: "storeName", value: "NOOR", group: "store" },
    { key: "email", value: "support@noorwatches.com", group: "store" },
    { key: "phone", value: "+92 300 1234567", group: "store" },
    { key: "whatsapp", value: "+92 300 1234567", group: "store" },
    { key: "currency", value: "Rs", group: "store" },
    // homepage (minimal so the home page doesn't crash if it reads these)
    { key: "announcementBar", value: "Free shipping on orders over Rs 5,000", group: "homepage" },
    { key: "heroTitle", value: "Timeless Elegance", group: "homepage" },
    { key: "heroSubtitle", value: "Discover premium watches crafted for every moment.", group: "homepage" },
    { key: "heroCta", value: "Shop Now", group: "homepage" },
  ];

  for (const s of settings) {
    await db.storeSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, group: s.group },
      create: s,
    });
  }
  console.log(`✔ Seeded ${settings.length} store settings`);

  // ---- Sample Category (optional) ----
  const cat = await db.category.upsert({
    where: { slug: "luxury-watches" },
    update: { name: "Luxury Watches", active: true, sortOrder: 1 },
    create: {
      name: "Luxury Watches",
      slug: "luxury-watches",
      description: "Premium timepieces for every occasion.",
      active: true,
      sortOrder: 1,
    },
  });
  console.log(`✔ Sample category ready: ${cat.slug}`);

  console.log("\nSeed complete. Log in at /admin/login");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
