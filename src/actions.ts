"use server";

import { db } from "../db";
import { nutritionLogs, workoutLogs, users } from "../db/schema";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers"; // Burası aynı
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

// --- GİRİŞ YAP (LOGIN) ---
export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  
  // 1. Kullanıcı var mı?
  let user = await db.select().from(users).where(eq(users.email, email)).get();

  // 2. Yoksa oluştur
  if (!user) {
    const result = await db.insert(users).values({
      fullName: "Yeni Kullanıcı",
      email: email,
      password: "hashed_password", 
      dailyCalorieGoal: 2000
    }).returning();
    user = result[0];
  }

  // 3. Çerez (Cookie) Ayarlama - GÜNCELLENEN KISIM BURASI
  const cookieStore = await cookies(); // Önce bekle
  cookieStore.set("user_session", user.id.toString(), { 
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 1 Hafta
  });

  redirect("/");
}

// --- ÇIKIŞ YAP (LOGOUT) ---
export async function logoutAction() {
  const cookieStore = await cookies(); // Burası da await istiyor
  cookieStore.delete("user_session");
  redirect("/login");
}

// ... Diğer fonksiyonların (addMeal, addWorkout) aynı kalabilir ...
export async function addMeal(formData: FormData) {
  const foodName = formData.get("foodName") as string;
  const calories = Number(formData.get("calories"));
  const mealType = formData.get("mealType") as string;
  // ... diğerleri ...

  await db.insert(nutritionLogs).values({
    userId: 1, 
    foodName,
    calories,
    mealType,
  });
  
  revalidatePath("/nutrition");
  revalidatePath("/"); 
}

export async function addWorkout(formData: FormData) {
    const notes = formData.get("notes") as string;
    const duration = Number(formData.get("duration"));

    await db.insert(workoutLogs).values({
        userId: 1,
        notes: notes, 
        durationMinutes: duration,
    });
    
    revalidatePath("/workouts");
    revalidatePath("/");
}