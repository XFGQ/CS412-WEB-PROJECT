import { db } from "../../../../db";
import { nutritionLogs } from "../../../../db/schema";
import { addMeal } from "@/actions";
import { desc, eq } from "drizzle-orm"; // eq eklemeyi unutma
import { cookies } from "next/headers"; // cookies eklemeyi unutma

export default async function NutritionPage() {
  // 1. ID'yi al
  const cookieStore = await cookies();
  const userId = Number(cookieStore.get("user_session")?.value);

  // 2. Filtreleyerek çek
  const logs = await db.select()
                       .from(nutritionLogs)
                       .where(eq(nutritionLogs.userId, userId)) // <-- FİLTRE BURADA
                       .orderBy(desc(nutritionLogs.id));

  // ... (Geri kalan hesaplamalar ve JSX aynı) ...
  
  const totalCalories = logs.reduce((sum, item) => sum + item.calories, 0);
  // ...
  
  return (
     // ... sayfa kodları aynı ...
     <div className="space-y-8">
        {/* ... */}
     </div>
  );
}
// ...