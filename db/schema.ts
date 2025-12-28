import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// 1. KULLANICI & AUTH (Giriş/Kayıt için)
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // Şifreli saklanacak
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  
  // Fiziksel Özellikler
  height: real("height"), // cm
  weight: real("weight"), // kg
  gender: text("gender"), // "male" | "female"
  activityLevel: text("activity_level"), // "sedentary", "active" vs.
  
  // Hedefler
  dailyCalorieGoal: integer("daily_calorie_goal").default(2000),
  dailyWaterGoal: integer("daily_water_goal").default(2500), // ml cinsinden
});

// 2. EGZERSİZ KÜTÜPHANESİ (Rehber Alanı İçin)
// Burası kullanıcının "Ne yapmalıyım?" dediği yerdeki sabit bilgilerdir.
export const exerciseLibrary = sqliteTable("exercise_library", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(), // Örn: "Bench Press"
  muscleGroup: text("muscle_group").notNull(), // Örn: "Chest", "Legs"
  difficulty: text("difficulty"), // "Beginner", "Advanced"
  description: text("description"), // Nasıl yapılır?
  videoUrl: text("video_url"), // Opsiyonel: YouTube linki
});

// 3. ANTRENMAN GÜNLÜĞÜ (Kullanıcının yaptığı sporlar)
export const workoutLogs = sqliteTable("workout_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  date: text("date").default(sql`CURRENT_DATE`),
  exerciseId: integer("exercise_id").references(() => exerciseLibrary.id), // Hangi hareketi yaptı?
  
  // Detaylar
  sets: integer("sets").default(3),
  reps: integer("reps").default(10),
  weightLifted: real("weight_lifted"), // Kaç kilo kaldırdı?
  durationMinutes: integer("duration_minutes"), // Cardio ise kaç dk sürdü?
  notes: text("notes"), // "Bugün zorlandım" vs.
});

// 4. BESLENME GÜNLÜĞÜ (Yenilen yemekler)
export const nutritionLogs = sqliteTable("nutrition_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  date: text("date").default(sql`CURRENT_DATE`),
  
  foodName: text("food_name").notNull(), // Örn: "Tavuk Göğsü"
  mealType: text("meal_type"), // "Kahvaltı", "Öğle", "Akşam", "Ara Öğün"
  
  calories: integer("calories").notNull(),
  protein: real("protein").default(0),
  carbs: real("carbs").default(0),
  fats: real("fats").default(0),
});

// 5. GÜNLÜK ÖZET (Su, Kilo takibi vb.)
export const dailyStats = sqliteTable("daily_stats", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  date: text("date").default(sql`CURRENT_DATE`),
  
  waterIntake: integer("water_intake").default(0), // ml
  weightRecorded: real("weight_recorded"), // O gün tartıldıysa kilosu
  mood: text("mood"), // "Enerjik", "Yorgun"
});