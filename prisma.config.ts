// Prisma 7+ config — connection URLs go here, NOT in schema.prisma
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Pooled connection (used at runtime by the app)
    url: process.env["DATABASE_URL"]!,
    // Direct connection (used by Prisma Migrate / db push)
    directUrl: process.env["DIRECT_URL"]!,
  },
});
