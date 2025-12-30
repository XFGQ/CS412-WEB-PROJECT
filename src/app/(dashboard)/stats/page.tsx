import { db } from "../../../../db";
import { workoutLogs, nutritionLogs } from "../../../../db/schema";
import { eq, desc } from "drizzle-orm";
import { cookies } from "next/headers";

export default async function StatsPage() {
  const cookieStore = await cookies();
  const userId = Number(cookieStore.get("user_session")?.value);
  
  // Son 7 kaydı çekelim
  const workouts = await db.select().from(workoutLogs).where(eq(workoutLogs.userId, userId)).orderBy(desc(workoutLogs.id)).limit(7);
  const nutrition = await db.select().from(nutritionLogs).where(eq(nutritionLogs.userId, userId)).orderBy(desc(nutritionLogs.id)).limit(7);

  // Basit Maksimum Değer Hesaplama (Grafik ölçeği için)
  const maxCalories = Math.max(...nutrition.map(n => n.calories), 2500);

  return (
    <div className="space-y-8 fade-in">
      <h1 className="text-3xl font-bold text-white">İlerleme Raporları 📈</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- KALORİ GRAFİĞİ (CSS Bar Chart) --- */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-bold text-white mb-6">Son Öğünlerdeki Kalori Alımı</h3>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {nutrition.length === 0 ? <p className="text-slate-500 w-full text-center self-center">Veri yok</p> : 
              nutrition.map((log, i) => (
                <div key={i} className="flex flex-col items-center gap-2 w-full group">
                   <div className="relative w-full flex justify-center">
                     <span className="absolute -top-8 text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 px-2 py-1 rounded">
                       {log.calories}
                     </span>
                     <div 
                        style={{ height: `${(log.calories / maxCalories) * 200}px` }} 
                        className="w-full max-w-[40px] bg-emerald-500/80 rounded-t-lg hover:bg-emerald-400 transition-all min-h-[10px]"
                     ></div>
                   </div>
                   <span className="text-xs text-slate-500 truncate w-16 text-center">{log.foodName.slice(0,6)}..</span>
                </div>
            ))}
          </div>
        </div>

        {/* --- SON ANTRENMAN DETAYLARI TABLOSU --- */}
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <h3 className="font-bold text-white mb-6">Antrenman Geçmişi</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="text-xs uppercase bg-slate-800/50 text-slate-300">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Tarih</th>
                  <th className="px-4 py-3">Aktivite</th>
                  <th className="px-4 py-3">Süre/Set</th>
                  <th className="px-4 py-3 rounded-r-lg">Detay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {workouts.length === 0 ? <tr><td colSpan={4} className="p-4 text-center">Kayıt yok</td></tr> : 
                  workouts.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">{w.date || "Bugün"}</td>
                    <td className="px-4 py-3 font-medium text-white">{w.notes}</td>
                    <td className="px-4 py-3">
                      {w.durationMinutes ? `${w.durationMinutes} dk` : `${w.sets} x ${w.reps}`}
                    </td>
                    <td className="px-4 py-3 text-emerald-400">
                      {w.weightLifted ? `${w.weightLifted} kg` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}