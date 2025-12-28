import { db } from "@/db"; // Database import yolun doğru olsun
import { nutritionLogs } from "@/db/schema";
import { addMeal, createTestUser } from "@/actions";
import { desc, eq } from "drizzle-orm";

export default async function NutritionPage() {
  // Önce test kullanıcısı yoksa oluşturalım (Sadece geliştirme aşaması için)
  await createTestUser();

  // Veritabanından verileri çek (Server Side Rendering)
  const logs = await db.select().from(nutritionLogs).orderBy(desc(nutritionLogs.id));

  // Toplam hesaplamalar
  const totalCalories = logs.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = logs.reduce((sum, item) => sum + (item.protein || 0), 0);
  const totalCarbs = logs.reduce((sum, item) => sum + (item.carbs || 0), 0);
  const totalFats = logs.reduce((sum, item) => sum + (item.fats || 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Beslenme Takibi 🍎</h1>
      </div>

      {/* Makro Kartları (Gerçek Veri) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MacroCard title="Kalori" current={totalCalories} target={2500} unit="kcal" color="text-emerald-400" barColor="bg-emerald-500" />
        <MacroCard title="Protein" current={Math.round(totalProtein)} target={160} unit="g" color="text-blue-400" barColor="bg-blue-500" />
        <MacroCard title="Karb." current={Math.round(totalCarbs)} target={300} unit="g" color="text-orange-400" barColor="bg-orange-500" />
        <MacroCard title="Yağ" current={Math.round(totalFats)} target={80} unit="g" color="text-yellow-400" barColor="bg-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Taraf: Yemek Listesi */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
          <h2 className="text-xl font-bold text-slate-200 mb-6">Bugünün Öğünleri</h2>
          
          <div className="space-y-4">
            {logs.length === 0 ? (
              <p className="text-slate-500 text-center py-4">Henüz bir öğün girmedin.</p>
            ) : (
              logs.map((log) => (
                <MealItem 
                  key={log.id}
                  name={log.foodName} 
                  cal={log.calories} 
                  type={log.mealType || "Diğer"} 
                />
              ))
            )}
          </div>
        </div>

        {/* Sağ Taraf: Hızlı Ekleme Formu */}
        <div className="bg-slate-800/40 border border-slate-700 p-6 rounded-2xl h-fit">
          <h3 className="font-bold text-lg mb-4 text-white">Hızlı Ekle</h3>
          <form action={addMeal} className="space-y-3">
            <input name="foodName" required placeholder="Yemek adı (Örn: Muz)" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
            
            <div className="grid grid-cols-2 gap-2">
              <input name="calories" type="number" required placeholder="Kalori" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
              <select name="mealType" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                <option value="Kahvaltı">Kahvaltı</option>
                <option value="Öğle">Öğle</option>
                <option value="Akşam">Akşam</option>
                <option value="Ara Öğün">Ara Öğün</option>
              </select>
            </div>

            {/* Detaylı Makrolar (Opsiyonel gibi duralım ama veri alalım) */}
            <div className="grid grid-cols-3 gap-2">
               <input name="protein" type="number" placeholder="Prot (g)" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white" />
               <input name="carbs" type="number" placeholder="Karb (g)" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white" />
               <input name="fats" type="number" placeholder="Yağ (g)" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white" />
            </div>

            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg transition-colors mt-2">
              + Kaydet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// --- Yardımcı Bileşenler (Aynı dosya altında kalabilir) ---

function MacroCard({ title, current, target, unit, color, barColor }: any) {
  const percentage = Math.min((current / target) * 100, 100);
  return (
    <div className="bg-slate-800/40 border border-slate-700 p-5 rounded-2xl">
      <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
      <div className="flex items-end gap-1 mb-3">
        <span className={`text-2xl font-bold ${color}`}>{current}</span>
        <span className="text-xs text-slate-500 mb-1">/ {target} {unit}</span>
      </div>
      <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
        <div style={{ width: `${percentage}%` }} className={`h-full ${barColor} transition-all duration-500`}></div>
      </div>
    </div>
  );
}

function MealItem({ name, cal, type }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-transparent hover:border-slate-700">
      <div className="flex items-center gap-4">
        <div>
          <h4 className="font-medium text-slate-200">{name}</h4>
          <span className="text-xs text-emerald-400/80 bg-emerald-400/10 px-2 py-0.5 rounded">{type}</span>
        </div>
      </div>
      <div className="font-bold text-slate-300">
        {cal} <span className="text-xs text-slate-500 font-normal">kcal</span>
      </div>
    </div>
  );
}