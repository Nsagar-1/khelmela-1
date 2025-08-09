import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// For MongoDB compatibility, we'll define User and InsertUser types manually
export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  admin: string;
  profilePhoto: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InsertUser {
  username: string;
  email: string;
  password: string;
  admin: string; 
  profilePhoto: string;

}

// Tournament schema
export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  game: text("game").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  status: text("status").notNull(), // 'upcoming', 'live', 'completed'
  prizePool: integer("prize_pool").notNull(),
  teamSize: text("team_size").notNull(),
  maxTeams: integer("max_teams").notNull(),
  registeredTeams: integer("registered_teams").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  rules: text("rules"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  organizer: text("organizer").notNull(),
  location: text("location"),
  entryFee: integer("entry_fee").default(0),
  bracket: jsonb("bracket")
});

export const insertTournamentSchema = createInsertSchema(tournaments).omit({
  id: true,
  createdAt: true,
});

export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type Tournament = typeof tournaments.$inferSelect;

// Stats schema
export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  label: text("label").notNull(),
  value: text("value").notNull(),
  order: integer("order").notNull(),
});

export const insertStatSchema = createInsertSchema(stats).omit({
  id: true,
});

export type InsertStat = z.infer<typeof insertStatSchema>;
export type Stat = typeof stats.$inferSelect;

// Team schema
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logo: text("logo"),
  captain: text("captain").notNull(),
  players: jsonb("players").notNull(),
  tournamentId: integer("tournament_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTeamSchema = createInsertSchema(teams).omit({
  id: true,
  createdAt: true,
});

export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

// Contact message schema
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
