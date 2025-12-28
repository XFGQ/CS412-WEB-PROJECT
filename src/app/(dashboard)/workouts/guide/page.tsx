export default function ExerciseGuidePage() {
  // Bu verileri normalde veritabanından çekeceğiz (db.select().from(exerciseLibrary)...)
  // Şimdilik tasarımın görünmesi için örnek veri (mock data) kullanıyoruz.
  const exercises = [
    { id: 1, name: "Bench Press", muscle: "Göğüs", difficulty: "Orta", desc: "Barı göğüs hizasına indirip kaldırarak göğüs kaslarını çalıştırır." },
    { id: 2, name: "Squat", muscle: "Bacak", difficulty: "Zor", desc: "Vücut ağırlığı veya bar ile çöküp kalkarak bacak ve kalça kaslarını güçlendirir." },
    { id: 3, name: "Deadlift", muscle: "Sırt/Bacak", difficulty: "İleri Seviye", desc: "Yerdeki ağırlığı bel ve bacak kuvvetiyle yukarı kaldırın." },
    { id: 4, name: "Plank", muscle: "Karın", difficulty: "Başlangıç", desc: "Dirsekler üzerinde vücudu düz tutarak karın kaslarını sıkın." },
    { id: 5, name: "Shoulder Press", muscle: "Omuz", difficulty: "Orta", desc: "Dambılları omuz hizasından yukarı doğru itin." },
    { id: 6, name: "Bicep Curl", muscle: "Kol", difficulty: "Başlangıç", desc: "Dambılları dirsekleri kırmadan yukarı kaldırın." },
  ];

  return (
    <div className="space-y-8">
      {/* Başlık ve Arama */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Egzersiz Kütüphanesi 📚</h1>
          <p className="text-slate-400 mt-1">Doğru formda spor yapmak için rehberiniz.</p>
        </div>
        <input 
          type="text" 
          placeholder="Egzersiz ara..." 
          className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 w-full md:w-64"
        />
      </div>

      {/* Egzersiz Kartları Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map((ex) => (
          <div key={ex.id} className="group bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl transition-all hover:shadow-lg hover:shadow-emerald-900/10">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-slate-800 text-slate-300 text-xs px-3 py-1 rounded-full border border-slate-700">
                {ex.muscle}
              </span>
              <span className={`text-xs px-2 py-1 rounded font-medium ${
                ex.difficulty === "Başlangıç" ? "text-green-400 bg-green-400/10" :
                ex.difficulty === "Orta" ? "text-yellow-400 bg-yellow-400/10" :
                "text-red-400 bg-red-400/10"
              }`}>
                {ex.difficulty}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-400 transition-colors mb-2">
              {ex.name}
            </h3>
            <p className="text-slate-400 text-sm mb-4 line-clamp-2">
              {ex.desc}
            </p>
            
            <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors">
              Detayları Gör & Video İzle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}