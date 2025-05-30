import {
  pgTable,
  integer,
  text,
} from "drizzle-orm/pg-core";;

export const outraTable = pgTable("outraTable", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  text: text("text").notNull(),
  fk_id: integer("fk_id"),
});

export const noTable = pgTable("noTable", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  titulo: text("titulo").notNull(),
});
