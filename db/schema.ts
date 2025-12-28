import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// 1. Antrenmanlar Tablosu (Örn: "Pazartesi Göğüs Antrenmanı")
export const workouts = sqliteTable("workouts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(), // Antrenman adı
  date: text("date").default(sql`CURRENT_TIMESTAMP`), // Tarih
  duration: integer("duration"), // Dakika cinsinden süre
});

// 2. Egzersizler Tablosu (Örn: "Bench Press", "Squat")
export const exercises = sqliteTable("exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workoutId: integer("workout_id").references(() => workouts.id), // Hangi antrenmana ait?
  name: text("name").notNull(), // Hareket adı
  weight: integer("weight"), // Ağırlık (kg)
  reps: integer("reps"), // Tekrar sayısı
  sets: integer("sets"), // Set sayısı
});