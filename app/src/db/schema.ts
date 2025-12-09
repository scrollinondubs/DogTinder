import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// ============================================
// NextAuth.js Required Tables
// ============================================

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  password: text("password"), // Hashed password for credentials auth
  name: text("name"),
  image: text("image"),
  role: text("role", { enum: ["USER", "SHELTER_ADMIN", "ADMIN"] }).default("USER").notNull(),
  emailVerified: integer("email_verified", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const sessions = sqliteTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
});

export const verificationTokens = sqliteTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.identifier, table.token] }),
}));

// ============================================
// Application Tables
// ============================================

export const shelters = sqliteTable("shelters", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  phone: text("phone"),
  email: text("email"),
  description: text("description"),
  imageUrl: text("image_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const dogs = sqliteTable("dogs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  shelterId: text("shelter_id").notNull().references(() => shelters.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  breed: text("breed").notNull(),
  age: integer("age").notNull(), // Age in years
  gender: text("gender", { enum: ["Male", "Female"] }).notNull(),
  size: text("size", { enum: ["Small", "Medium", "Large", "Extra Large"] }).notNull(),
  description: text("description"),
  status: text("status", { enum: ["available", "pending", "adopted"] }).default("available").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const dogImages = sqliteTable("dog_images", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  dogId: text("dog_id").notNull().references(() => dogs.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  isPrimary: integer("is_primary", { mode: "boolean" }).default(false).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const likes = sqliteTable("likes", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  dogId: text("dog_id").notNull().references(() => dogs.id, { onDelete: "cascade" }),
  liked: integer("liked", { mode: "boolean" }).notNull(), // true = liked, false = passed
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const appointmentRequests = sqliteTable("appointment_requests", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  dogId: text("dog_id").notNull().references(() => dogs.id, { onDelete: "cascade" }),
  shelterId: text("shelter_id").notNull().references(() => shelters.id, { onDelete: "cascade" }),
  preferredDate: text("preferred_date").notNull(), // ISO date string
  preferredTime: text("preferred_time").notNull(),
  message: text("message"),
  status: text("status", { enum: ["pending", "confirmed", "cancelled", "completed"] }).default("pending").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const conversations = sqliteTable("conversations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  shelterId: text("shelter_id").notNull().references(() => shelters.id, { onDelete: "cascade" }),
  dogId: text("dog_id").references(() => dogs.id, { onDelete: "set null" }), // Optional context
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  conversationId: text("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  senderId: text("sender_id").notNull(), // Can be user ID or shelter ID
  senderType: text("sender_type", { enum: ["user", "shelter"] }).notNull(),
  content: text("content").notNull(),
  readAt: integer("read_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================
// Relations
// ============================================

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  likes: many(likes),
  appointmentRequests: many(appointmentRequests),
  conversations: many(conversations),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const sheltersRelations = relations(shelters, ({ many }) => ({
  dogs: many(dogs),
  appointmentRequests: many(appointmentRequests),
  conversations: many(conversations),
}));

export const dogsRelations = relations(dogs, ({ one, many }) => ({
  shelter: one(shelters, {
    fields: [dogs.shelterId],
    references: [shelters.id],
  }),
  images: many(dogImages),
  likes: many(likes),
  appointmentRequests: many(appointmentRequests),
}));

export const dogImagesRelations = relations(dogImages, ({ one }) => ({
  dog: one(dogs, {
    fields: [dogImages.dogId],
    references: [dogs.id],
  }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  dog: one(dogs, {
    fields: [likes.dogId],
    references: [dogs.id],
  }),
}));

export const appointmentRequestsRelations = relations(appointmentRequests, ({ one }) => ({
  user: one(users, {
    fields: [appointmentRequests.userId],
    references: [users.id],
  }),
  dog: one(dogs, {
    fields: [appointmentRequests.dogId],
    references: [dogs.id],
  }),
  shelter: one(shelters, {
    fields: [appointmentRequests.shelterId],
    references: [shelters.id],
  }),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(users, {
    fields: [conversations.userId],
    references: [users.id],
  }),
  shelter: one(shelters, {
    fields: [conversations.shelterId],
    references: [shelters.id],
  }),
  dog: one(dogs, {
    fields: [conversations.dogId],
    references: [dogs.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

// ============================================
// Type Exports
// ============================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Shelter = typeof shelters.$inferSelect;
export type NewShelter = typeof shelters.$inferInsert;
export type Dog = typeof dogs.$inferSelect;
export type NewDog = typeof dogs.$inferInsert;
export type DogImage = typeof dogImages.$inferSelect;
export type Like = typeof likes.$inferSelect;
export type AppointmentRequest = typeof appointmentRequests.$inferSelect;
export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
