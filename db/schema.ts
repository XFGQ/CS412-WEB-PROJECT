import { sqliteTable, text, integer ,uniqueIndex} from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import { createId } from '@paralleldrive/Icuid2';
 
              //USERS
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  username: text('username').notNull(),
  password: text('password').notNull(),  
  avatarUrl: text('avatar_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
          //CHATS
export const chats = sqliteTable('chats', { // <-- BURADA 'export' OLMALI
    id: integer('id').primaryKey({ autoIncrement: true }),
    type: text('type', { enum: ['private', 'group'] }).notNull(), 
    name: text('name'), 
    adminId: integer('admin_id').references(() => users.id),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});


        //MESSAGES
export const messages = sqliteTable('messages', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    
    // BURAYI KONTROL ET
    chatId: integer('chat_id').notNull().references(() => chats.id), 
    
    // BURAYI KONTROL ET
    senderId: integer('sender_id').notNull().references(() => users.id),
    
    content: text('content').notNull(),
    type: text('type', { enum: ['text', 'file', 'sticker'] }).default('text'),
    createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
 

export const chatMembers = sqliteTable('chat_members', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    
    // Sütun adı ile reference edilen tablonun adı doğru mu?
    // chats.id'yi referans ediyor:
    chatId: integer('chat_id').notNull().references(() => chats.id, { onDelete: 'cascade' }), // <-- BU SATIRI KONTROL ET

    // users.id'yi referans ediyor:
    memberId: integer('member_id').notNull().references(() => users.id, { onDelete: 'cascade' }), // <-- BU SATIRI KONTROL ET
    
    joinedAt: integer('joined_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
    
}, (t) => ({
    // t.chatId ve t.memberId'nin parantez içinde virgülle ayrıldığına dikkat edin.
    unq: uniqueIndex('chat_member_unq').on(t.chatId, t.memberId), 
}));

