import { relations } from "drizzle-orm";
import { integer, pgTable, varchar, timestamp } from "drizzle-orm/pg-core";

const timestamps = {

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()).notNull()
}

export const departemen = pgTable('departemen', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    code: varchar('code', {length: 50}).notNull().unique(),
    name: varchar('name', {length: 255}).notNull(),
    description: varchar('description', {length: 255}),
    ...timestamps
})

export const subjects = pgTable('subjects', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    departemenId: integer('departemen_id').notNull().references(() => departemen.id, { onDelete: 'restrict'}),
    code: varchar('code', {length: 50}).notNull().unique(),
    name: varchar('name', {length: 255}).notNull(),
    description: varchar('description', {length: 255}),
    ...timestamps
})

export const departemenRelations = relations(departemen, ({ many }) => ({subjects: many(subjects)}))
export const subjectsRelations = relations(subjects, ({ one, many }) => ({
    departemen: one(departemen, {
        fields: [subjects.departemenId],
        references: [departemen.id]
    })
}));

export type Departemen = typeof departemen.$inferSelect;
export type newDepartemen = typeof departemen.$inferInsert;

export type Subjects = typeof subjects.$inferSelect;
export type newSubjects = typeof subjects.$inferInsert;