import { eq } from 'drizzle-orm';
import { closeDbConnection, getDbConnection } from './index';
import { logbookTable, type LogbookTableInsert } from './schema';
const db = getDbConnection();

const { lastInsertRowid } = await db.insert(logbookTable).values({
    title: 'Test 007',
    description: 'This is a test description for the logbook entry.',
    context: 'Testing the logbook entry insertion.',
    startDate: new Date().toISOString(),
    impact: true
} satisfies LogbookTableInsert);

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

closeDbConnection(db);
