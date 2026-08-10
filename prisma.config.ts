import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Arahkan url langsung ke DIRECT_URL untuk operasi db push / schema sync
    url: process.env["DIRECT_URL"] || "",
  },
});
