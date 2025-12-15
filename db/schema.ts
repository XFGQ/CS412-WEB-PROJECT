import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2'; // Rastgele ID üretmek için (opsiyonel ama iyi olur)
// Not: npm install @paralleldrive/cuid2 yapman gerekebilir, yoksa crypto.randomUUID() kullanabiliriz.
// Şimdilik basit olması için string ID'leri text olarak tutacağız.

// --- KULLANICILAR ---
export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text('username').notNull(),
});
