import { integer, pgTable, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  signature: text(),  // 用户的邮件签名
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const accountsTable = pgTable("accounts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull().references(() => usersTable.id),
  name: varchar({ length: 255 }).notNull(),  // 账户名称
  isActive: boolean().default(true).notNull(),  // 账户是否激活
  // SMTP 服务器配置
  smtpHost: varchar({ length: 255 }).notNull(),
  smtpPort: integer().notNull(),
  smtpSecure: boolean().notNull(),
  smtpUser: varchar({ length: 255 }).notNull(),
  smtpPass: varchar({ length: 255 }).notNull(),
  // IMAP 服务器配置
  imapHost: varchar({ length: 255 }).notNull(),
  imapPort: integer().notNull(),
  imapSecure: boolean().notNull(),
  imapUser: varchar({ length: 255 }).notNull(),
  imapPass: varchar({ length: 255 }).notNull(),
  // 默认发件人配置
  defaultFromName: varchar({ length: 255 }).notNull(),
  defaultFromAddress: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const foldersTable = pgTable("folders", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull().references(() => usersTable.id),
  accountId: integer().notNull().references(() => accountsTable.id),  // 关联到具体邮箱账户
  name: varchar({ length: 255 }).notNull(),
  path: varchar({ length: 255 }).notNull(),
  type: varchar({ length: 50 }).notNull(), // inbox, sent, drafts, trash, etc.
  lastSyncAt: timestamp(),  // 最后同步时间
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const emailsTable = pgTable("emails", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().notNull().references(() => usersTable.id),
  accountId: integer().notNull().references(() => accountsTable.id),  // 关联到具体邮箱账户
  folderId: integer().notNull().references(() => foldersTable.id),
  messageId: varchar({ length: 255 }).notNull(),
  subject: text().notNull(),
  from: varchar({ length: 255 }).notNull(),
  to: text().notNull(),
  cc: text(),
  bcc: text(),
  content: text().notNull(),
  isRead: boolean().default(false).notNull(),
  isFlagged: boolean().default(false).notNull(),
  receivedAt: timestamp().notNull(),
  syncStatus: varchar({ length: 50 }).notNull().default('synced'),  // synced, pending_update, pending_delete
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

export const attachmentsTable = pgTable("attachments", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  emailId: integer().notNull().references(() => emailsTable.id),
  filename: varchar({ length: 255 }).notNull(),
  contentType: varchar({ length: 100 }).notNull(),
  size: integer().notNull(),
  path: varchar({ length: 255 }).notNull(),
  syncStatus: varchar({ length: 50 }).notNull().default('synced'),  // synced, pending_upload, pending_delete
  createdAt: timestamp().defaultNow().notNull(),
});