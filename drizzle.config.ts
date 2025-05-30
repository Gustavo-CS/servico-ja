import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/infra/schema.js",
  // out: "./drizzle/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
