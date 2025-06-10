import { pgTable, text, serial, integer, boolean, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name_ru: text("name_ru").notNull(),
  name_kz: text("name_kz").notNull(),
  description_ru: text("description_ru"),
  description_kz: text("description_kz"),
  image_url: text("image_url"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name_ru: text("name_ru").notNull(),
  name_kz: text("name_kz").notNull(),
  description_ru: text("description_ru"),
  description_kz: text("description_kz"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  unit_ru: text("unit_ru").notNull(),
  unit_kz: text("unit_kz").notNull(),
  category_id: integer("category_id").references(() => categories.id),
  image_url: text("image_url"),
  in_stock: boolean("in_stock").default(true),
});

export const requests = pgTable("requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  comment: text("comment"),
  created_at: text("created_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertRequestSchema = createInsertSchema(requests).omit({
  id: true,
  created_at: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertRequest = z.infer<typeof insertRequestSchema>;
export type Request = typeof requests.$inferSelect;
