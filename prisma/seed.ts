import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await hash("Rifas2024!", 12);

  const mauro = await prisma.user.upsert({
    where: { email: "mauro@admin.com" },
    update: {},
    create: {
      email: "mauro@admin.com",
      passwordHash: password,
      role: "SUPERADMIN",
      status: "ACTIVE",
    },
  });

  const jonathan = await prisma.user.upsert({
    where: { email: "jonathan@admin.com" },
    update: {},
    create: {
      email: "jonathan@admin.com",
      passwordHash: password,
      role: "SUPERADMIN",
      status: "ACTIVE",
    },
  });

  console.log("✅ Usuarios creados:");
  console.log(`   - ${mauro.email} (${mauro.role})`);
  console.log(`   - ${jonathan.email} (${jonathan.role})`);
}

main()
  .catch((e) => {
    console.error("❌ Error al ejecutar seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
