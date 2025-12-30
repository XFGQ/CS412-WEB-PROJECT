import { db } from "../../../../db";
import { users } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { updateProfile } from "@/actions";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const userId = Number(cookieStore.get("user_session")?.value);
  const user = await db.select().from(users).where(eq(users.id, userId)).get();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8 fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white">Ayarlar ⚙️</h1>
        <p className="text-slate-400 mt-1">Profil bilgilerini ve hedeflerini buradan yönet.</p>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">Fiziksel Bilgiler</h2>
        
        <form action={updateProfile} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-slate-300">Boy (cm)</label>
              <input name="height" type="number" defaultValue={user.height || 0} className="w-full mt-2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Mevcut Kilo (kg)</label>
              <input name="weight" type="number" defaultValue={user.weight || 0} className="w-full mt-2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Hedef Kilo (kg)</label>
              <input name="goalWeight" type="number" defaultValue={user.goalWeight || 0} className="w-full mt-2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Günlük Kalori Hedefi</label>
              <input name="dailyCalorieGoal" type="number" defaultValue={user.dailyCalorieGoal || 2000} className="w-full mt-2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-900/20">
              Değişiklikleri Kaydet
            </button>
          </div>
        </form>
      </div>

      <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 flex items-center justify-between">
        <div>
           <h3 className="text-red-400 font-bold">Hesap Bölgesi</h3>
           <p className="text-xs text-red-400/60 mt-1">Bu işlem geri alınamaz.</p>
        </div>
        <button className="text-red-400 border border-red-500/20 px-4 py-2 rounded-lg text-sm hover:bg-red-500/10 transition-colors">
          Hesabı Sil
        </button>
      </div>
    </div>
  );
}