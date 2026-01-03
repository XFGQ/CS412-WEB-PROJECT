import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// KULLANICI TABLOSU (Güncellendi)
export const users = sqliteTable("users", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	fullName: text("full_name").notNull(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),

	// Fiziksel Özellikler
	age: integer("age"), // YENİ: Yaş
	height: real("height"), // YENİ: Boy (cm)
	weight: real("weight"), // Mevcut Kilo
	goalWeight: real("goal_weight"), // Hedef Kilo

	createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
	dailyCalorieGoal: integer("daily_calorie_goal").default(2000),
});

// ... Diğer tablolar (exerciseLibrary, workoutLogs vs.) aynen kalabilir ...
// Onları silmene gerek yok, sadece users tablosunu güncelle.
// (Eğer nutritionLogs vs. kodları lazımsa önceki mesajlardan alabilirsin, buraya sadece değişeni koydum)
export const nutritionLogs = sqliteTable("nutrition_logs", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	userId: integer("user_id").references(() => users.id),
	foodName: text("food_name").notNull(),
	calories: integer("calories").notNull(),
	mealType: text("meal_type"),
	protein: real("protein").default(0),
	carbs: real("carbs").default(0),
	fats: real("fats").default(0),
	date: text("date").default(sql`CURRENT_DATE`),
});

export const workoutLogs = sqliteTable("workout_logs", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	userId: integer("user_id").references(() => users.id),
	notes: text("notes"),
	durationMinutes: integer("duration_minutes"),
	weightLifted: real("weight_lifted"),
	sets: integer("sets"),
	reps: integer("reps"),
	date: text("date").default(sql`CURRENT_DATE`),
});
