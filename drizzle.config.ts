import { defineConfig } from 'drizzle-kit';
import {} from 'bun';

export const DB_FILE_NAME = 'db/mll-db.sqlite';

export default defineConfig({
    out: './db/drizzle',
    schema: './db/schema.ts',
    dialect: 'turso',
    dbCredentials: {
        url: DB_FILE_NAME
    }
});
