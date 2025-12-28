import { db } from "./db"; // db'yi export ettiğin dosya yolu (index.ts ise ./src/db/index)
import { workouts, exercises } from "./db/schema";

async function main() {
  console.log("🌱 Veri ekleniyor...");

  // 1. Yeni bir antrenman ekle
  const newWorkout = await db.insert(workouts).values({
    name: "İlk Antrenmanım: Full Body",
    duration: 60,
  }).returning(); 
  
  const workoutId = newWorkout[0].id;
  console.log("✅ Antrenman eklendi ID:", workoutId);

  // 2. Bu antrenmana egzersiz ekle
  await db.insert(exercises).values([
    { workoutId, name: "Bench Press", weight: 60, sets: 3, reps: 10 },
    { workoutId, name: "Squat", weight: 80, sets: 4, reps: 8 },
  ]);
  console.log("✅ Egzersizler eklendi.");

  // 3. Verileri oku ve ekrana bas
  const result = await db.select().from(workouts);
  console.log("📊 Veritabanındaki Antrenmanlar:", result);
}

main();