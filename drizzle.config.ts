import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config(); // Load environment variables from .env file

export default defineConfig({
    schema: 'src/layers/lib/database/schema', // Path to your schema file
    out: 'drizzle', // Path to store migrations
    // driver: 'pglite', // Database driver (for PostgreSQL
    dbCredentials: {
        url: process.env.DATABASE_URL!, // Connection string from environment variables
    },
    dialect: 'postgresql',
    strict: false,
});
