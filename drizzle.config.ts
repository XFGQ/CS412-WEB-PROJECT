import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();
console.log("DB URL Kontrol:", process.env.DATABASE_URL);
export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",  
  dbCredentials: {
    url: "sqlite.db",  
  },
});