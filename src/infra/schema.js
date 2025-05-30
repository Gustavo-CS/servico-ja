import {
  pgTable,
  integer,
  text,
} from "drizzle-orm/pg-core";;

export const noTable = pgTable("noTable", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(), //generatedAlwaysAsIdentity é o autoincrement do neon
  titulo: text("titulo").notNull(),
});
