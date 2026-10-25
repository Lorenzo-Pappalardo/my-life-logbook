import { drizzle } from 'drizzle-orm/tursodatabase/database';
import { DB_FILE_NAME } from '../drizzle.config';
import { logbookTable, type logbookTableInsert } from './schema';
import { eq } from 'drizzle-orm';

const db = drizzle({ connection: { path: DB_FILE_NAME } });
console.log('DB connection established with file:', DB_FILE_NAME);

const { lastInsertRowid } = await db.insert(logbookTable).values({
    title: 'Test 007',
    description: 'This is a test description for the logbook entry.',
    context: 'Testing the logbook entry insertion.',
    startDate: new Date().toISOString(),
    impact: true
} satisfies logbookTableInsert);

console.log('Before:', await db.select().from(logbookTable).all());

await new Promise(resolve => setTimeout(resolve, 2000));

await db
    .update(logbookTable)
    .set({
        title: 'Updated Test 007',
        updatedAt: new Date().toISOString()
    })
    .where(eq(logbookTable.id, lastInsertRowid));

console.log('After:', await db.select().from(logbookTable).all());

db.$client.close();
