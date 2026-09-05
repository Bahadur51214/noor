import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({ datasources: { db: { url: "postgresql://neondb_owner:npg_HU6m1CMjptLv@ep-lingering-frog-awqjfmaf.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=15" } } });
async function main() {
  const rows = await prisma.storeSetting.findMany({ where: { group: "shipping" } });
  for (const r of rows) { console.log(r.key, "=>", JSON.stringify(r.value)); }
  await prisma.$disconnect();
}
main();
