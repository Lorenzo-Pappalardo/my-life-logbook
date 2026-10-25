import { int, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const logbookTable = sqliteTable('logbook', {
    id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
    description: text(),
    context: text().notNull(),
    startDate: text().notNull(),
    endDate: text(),
    impact: integer({ mode: 'boolean' }).notNull(),
    createdAt: text().default(new Date().toISOString()),
    updatedAt: text().default(new Date().toISOString())
});

export type logbookTableSelect = typeof logbookTable.$inferSelect;
export type logbookTableInsert = typeof logbookTable.$inferInsert;
