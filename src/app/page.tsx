export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Üst Karşılama Paneli */}
      <section className="bg-gray-800/50 p-8 rounded-3xl border border-gray-700 backdrop-blur-sm">
        <h1 className="text-3xl font-bold">Tekrar Hoş Geldin, Kayra! 👋</h1>
        <p className="text-gray-400 mt-2">Bugün hedeflerine ulaşmak için harika bir gün.</p>
        <div className="mt-6 w-full bg-gray-700 h-3 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-full w-[65%]" title="Haftalık Hedef %65"></div>
        </div>
        <p className="text-sm text-gray-400 mt-2">Haftalık antrenman hedefinin %65'ini tamamladın.</p>
      </section>

      {/* İstatistik Kartları Grid Yapısı */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Yakılan Kalori" value="1,240" unit="kcal" icon="🔥" color="text-orange-400" />
        <StatCard title="Su Tüketimi" value="1.5" unit="Litre" icon="💧" color="text-blue-400" />
        <StatCard title="Günlük Adım" value="8,432" unit="Adım" icon="👟" color="text-emerald-400" />
        <StatCard title="Uyku" value="7h 20m" unit="" icon="🌙" color="text-purple-400" />
      </div>

      {/* Alt Bölüm: Grafik ve Hızlı İşlemler */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-800/40 p-6 rounded-2xl border border-gray-700 min-h-[300px]">
          <h3 className="text-xl font-semibold mb-4">Haftalık Aktivite</h3>
          <div className="flex items-end justify-between h-48 px-4">
            {/* Basit bir grafik görseli (Veritabanına bağlayacağız) */}
            {[40, 70, 45, 90, 65, 80, 30].map((height, i) => (
              <div key={i} style={{ height: `${height}%` }} className="w-8 bg-emerald-500/80 rounded-t-md hover:bg-emerald-400 transition-colors"></div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-500">
            <span>Pzt</span><span>Sal</span><span>Çar</span><span>Per</span><span>Cum</span><span>Cmt</span><span>Paz</span>
          </div>
        </div>

        <div className="space-y-4">
          <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20">
            + Antrenman Kaydet
          </button>
          <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20">
            + Öğün Ekle
          </button>
          <div className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700">
            <h3 className="font-semibold mb-2">Yapay Zeka Koçu</h3>
            <p className="text-sm text-gray-400 italic">"Dün akşamki koşun harikaydı! Bugün biraz dinlenmeye ne dersin?"</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Yardımcı Bileşen
function StatCard({ title, value, unit, icon, color }: any) {
  return (
    <div className="bg-gray-800/40 p-6 rounded-2xl border border-gray-700 hover:border-gray-500 transition-all">
      <div className="text-2xl mb-2">{icon}</div>
      <h4 className="text-gray-400 text-sm font-medium">{title}</h4>
      <div className="flex items-baseline gap-1 mt-1">
        <span className={`text-2xl font-bold ${color}`}>{value}</span>
        <span className="text-xs text-gray-500">{unit}</span>
      </div>
    </div>
  );
}