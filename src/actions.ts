"use server";

import { db } from "../db";
import { nutritionLogs, workoutLogs, users } from "../db/schema";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";

// --- REGISTER ---
export async function registerAction(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  // Numerical Data
  const age = Number(formData.get("age"));
  const height = Number(formData.get("height"));
  const weight = Number(formData.get("weight"));
  const goalWeight = Number(formData.get("goalWeight"));

  // 1. Check if user already exists with this email
  const existingUser = await db.select().from(users).where(eq(users.email, email)).get();
  
  if (existingUser) {
    // In a real project, return an error message; for now, redirect to login
    return redirect("/login?error=exists"); 
  }

  // 2. Save new user
  const result = await db.insert(users).values({
    fullName,
    email,
    password, // Note: Password should be hashed with bcrypt in a real project!
    age,
    height,
    weight,
    goalWeight,
    dailyCalorieGoal: 2000 + (weight * 10) // Simple calorie goal calculation example
  }).returning();

  // 3. Auto login (Create Session)
  const user = result[0];
  const cookieStore = await cookies();
  cookieStore.set("user_session", user.id.toString(), { 
    httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 
  });

  redirect("/");
}

// --- LOGIN ---
export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 1. Check User and Password
  // (Do both email and password match?)
  const user = await db.select().from(users)
    .where(and(eq(users.email, email), eq(users.password, password)))
    .get();

  if (!user) {
    // If user not found or password incorrect, redirect back to login
    return redirect("/login?error=invalid");
  }

  // 2. Login Successful -> Set Cookie
  const cookieStore = await cookies();
  cookieStore.set("user_session", user.id.toString(), { 
    httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 
  });

  redirect("/");
}

// --- LOGOUT ---
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("user_session");
  redirect("/login");
}

// --- ADD MEAL ---
export async function addMeal(formData: FormData) {
  const cookieStore = await cookies();
  const userId = Number(cookieStore.get("user_session")?.value);
  if (!userId) return;

  const foodName = formData.get("foodName") as string;
  const calories = Number(formData.get("calories"));
  const mealType = formData.get("mealType") as string;
  const protein = Number(formData.get("protein")) || 0;
  const carbs = Number(formData.get("carbs")) || 0;
  const fats = Number(formData.get("fats")) || 0;

  await db.insert(nutritionLogs).values({
    userId, foodName, calories, mealType, protein, carbs, fats
  });
  revalidatePath("/nutrition"); revalidatePath("/");
}

// --- ADD WORKOUT ---
export async function addWorkout(formData: FormData) {
  const cookieStore = await cookies();
  const userId = Number(cookieStore.get("user_session")?.value);
  if (!userId) return;

  const title = formData.get("title") as string;
  const duration = Number(formData.get("duration")) || 0;
  const weight = Number(formData.get("weight")) || 0;
  const sets = Number(formData.get("sets")) || 0;
  const reps = Number(formData.get("reps")) || 0;

  await db.insert(workoutLogs).values({
    userId, notes: title, durationMinutes: duration, weightLifted: weight, sets, reps
  });
  revalidatePath("/workouts"); revalidatePath("/");
}

// --- UPDATE PROFILE ---
export async function updateProfile(formData: FormData) {
  const cookieStore = await cookies();
  const userId = Number(cookieStore.get("user_session")?.value);
  if (!userId) return;

  const height = Number(formData.get("height"));
  const weight = Number(formData.get("weight"));
  const goalWeight = Number(formData.get("goalWeight"));
  const dailyCalorieGoal = Number(formData.get("dailyCalorieGoal"));

  await db.update(users).set({
    height,
    weight,
    goalWeight,
    dailyCalorieGoal
  }).where(eq(users.id, userId));

  revalidatePath("/settings");
  revalidatePath("/");
}