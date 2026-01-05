import { db } from "./db"; // The path where you export db
import { workouts, exercises } from "./db/schema";

async function main() {
  console.log("🌱 Seeding data...");

  // 1. Add a new workout
  const newWorkout = await db.insert(workouts).values({
    name: "My First Workout: Full Body",
    duration: 60,
  }).returning(); 
  
  const workoutId = newWorkout[0].id;
  console.log("✅ Workout added with ID:", workoutId);

  // 2. Add exercises to this workout
  await db.insert(exercises).values([
    { workoutId, name: "Bench Press", weight: 60, sets: 3, reps: 10 },
    { workoutId, name: "Squat", weight: 80, sets: 4, reps: 8 },
  ]);
  console.log("✅ Exercises added.");

  // 3. Read data and print to console
  const result = await db.select().from(workouts);
  console.log("📊 Workouts in Database:", result);
}

main();