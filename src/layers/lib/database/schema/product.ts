import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";


export const product = pgTable('products',{
    id: serial('id').primaryKey(),
    name: varchar('name',{length:255}).notNull(),
    price: integer('price').notNull()
})



