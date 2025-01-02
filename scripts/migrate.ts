import { config } from "dotenv";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../src/layers/lib/database/schema";
import path from "path";

config();

async function main() {
  try {

    console.log("Starting migration...");
    // await setTimeout(5000)

    // Load environment variables
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL is not set in the environment variables.");
    }

    // Initialize database connection
    const pool = new Pool({ connectionString });
    const db = drizzle(pool, { schema });

    // Resolve migrations folder path
    const migrationsPath = path.resolve(__dirname, "../drizzle");
    console.log("Migrations Path:", migrationsPath);

    // Run migrations
    await migrate(db, { migrationsFolder: migrationsPath });
    console.log("Migration complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
}

main();
