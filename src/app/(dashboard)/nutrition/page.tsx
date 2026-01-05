import { db } from "../../../../db";
import { nutritionLogs } from "../../../../db/schema";
import { addMeal } from "@/actions";
import { desc, eq } from "drizzle-orm"; // Remember to add eq
import { cookies } from "next/headers"; // Remember to add cookies

export default async function NutritionPage() {
  // 1. Get User ID
  const cookieStore = await cookies();
  const userId = Number(cookieStore.get("user_session")?.value);

  // 2. Fetch data with filter
  const logs = await db.select()
                       .from(nutritionLogs)
                       .where(eq(nutritionLogs.userId, userId)) // <-- FILTER HERE
                       .orderBy(desc(nutritionLogs.id));

  // ... (Calculations and JSX remain the same) ...
  
  const totalCalories = logs.reduce((sum, item) => sum + item.calories, 0);
  // ...
  
  return (
      // ... page code same ...
      <div className="space-y-8">
        {/* ... */}
      </div>
  );
}
// ...