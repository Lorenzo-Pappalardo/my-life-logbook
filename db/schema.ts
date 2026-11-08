import { int, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const logbookTable = sqliteTable('logbook', {
    id: int().primaryKey({ autoIncrement: true }),
    title: text().notNull(),
    description: text(),
    context: text().notNull(),
    startDate: text().notNull(),
    endDate: text(),
    impact: integer({ mode: 'boolean' }).notNull(),
    createdAt: text().default(new Date().toDateString()),
    updatedAt: text().default(new Date().toDateString())
});

export type LogbookTableCreate = Omit<typeof logbookTable.$inferInsert, 'id' | 'createdAt' | 'updatedAt'>;
export type LogbookTableRead = typeof logbookTable.$inferSelect;
export type LogbookTableUpdate = typeof logbookTable.$inferInsert;
