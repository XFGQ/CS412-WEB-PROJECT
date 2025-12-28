import { db } from "../../../db";
import { nutritionLogs, workoutLogs } from "../../../db/schema";
import { logoutAction } from "@/actions";

export default async function Dashboard() {
  const nutritionData = await db.select().from(nutritionLogs);
  const workoutData = await db.select().from(workoutLogs);
  
  const totalCaloriesIn = nutritionData.reduce((acc, curr) => acc + curr.calories, 0);
  const totalWorkouts = workoutData.length;
  const totalWorkoutMinutes = workoutData.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);

  return (
    <div className="space-y-8 fade-in">
      {/* Hero Bölümü: Özet Bilgi */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900/40 to-slate-900 border border-emerald-500/20 rounded-3xl p-8">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Bugünün Özeti ⚡</h1>
            <p className="text-slate-400">Hedeflerine ulaşmak için harika bir gün. Aktiviteni kaydetmeyi unutma!</p>
          </div>
          <form action={logoutAction}>
            <button className="bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-300 px-5 py-2.5 rounded-xl text-sm font-medium transition-all border border-slate-700 hover:border-red-500/50">
              Oturumu Kapat
            </button>
          </form>
        </div>
        {/* Arkaplan Efekti */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none"></div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Alınan Kalori" value={totalCaloriesIn} unit="kcal" icon="🍎" color="text-orange-400" bg="bg-orange-400/10" />
        <StatCard title="Antrenman" value={totalWorkouts} unit="Adet" icon="💪" color="text-emerald-400" bg="bg-emerald-400/10" />
        <StatCard title="Aktif Süre" value={totalWorkoutMinutes} unit="Dk" icon="⏱️" color="text-blue-400" bg="bg-blue-400/10" />
        <StatCard title="Su Tüketimi" value="1.5" unit="Lt" icon="💧" color="text-cyan-400" bg="bg-cyan-400/10" />
      </div>

      {/* Alt Bölüm */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Grafik Alanı */}
         <div className="lg:col-span-2 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 min-h-[300px] flex flex-col justify-center items-center text-slate-500">
            <span className="text-4xl mb-2">📊</span>
            <p>Haftalık Aktivite Grafiği</p>
            <span className="text-xs text-slate-600 mt-2">(Chart.js eklenecek)</span>
         </div>

         {/* AI Önerisi */}
         <div className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">✨</div>
              <h3 className="font-bold text-white">AI Koçun Diyor ki:</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              "Son 3 gündür kardiyo ağırlıklı çalıştın. Kaslarını şaşırtmak için bugün hafif bir ağırlık antrenmanı veya Yoga yapmayı deneyebilirsin."
            </p>
         </div>
      </div>
    </div>
  );
}

// Güncellenmiş Kart Tasarımı
function StatCard({ title, value, unit, icon, color, bg }: any) {
  return (
    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 transition-all group cursor-default">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${bg} ${color}`}>
          {icon}
        </div>
        {/* Sağ üstte minik bir artış ikonu */}
        <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">+2%</span>
      </div>
      <div>
        <h4 className="text-slate-400 text-sm font-medium">{title}</h4>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-bold text-white group-hover:scale-105 transition-transform origin-left">{value}</span>
          <span className="text-xs text-slate-500 font-medium">{unit}</span>
        </div>
      </div>
    </div>
  );
}