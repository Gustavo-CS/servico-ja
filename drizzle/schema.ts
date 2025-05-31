import { pgTable, integer, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const neonTable = pgTable("neonTable", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "noTable4_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	titulo: text().notNull(),
	column1: text("column_1"),
});
