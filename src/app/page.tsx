import { db } from "../../db";
import { workouts } from "../../db/schema";
import { desc } from "drizzle-orm";
import FitnessChat from "../components/FitnessChat"; // Yeni bileşeni import ettik

export default async function Home() {
  const allWorkouts = await db.select().from(workouts).orderBy(desc(workouts.id));

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL TARAF: Ana İçerik (%66) */}
        <div className="lg:col-span-2 space-y-6">
          <header className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">🏋️ Fitness Takip</h1>
              <p className="text-gray-500">Antrenman geçmişin ve istatistiklerin</p>
            </div>
            <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-black transition">
              + Yeni Ekle
            </button>
          </header>

          {/* Antrenman Listesi */}
          <div className="space-y-4">
            {allWorkouts.length === 0 ? (
              <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl text-center">
                <p className="text-gray-500">Henüz kayıt yok. Sağdaki asistana sormayı dene!</p>
              </div>
            ) : (
              allWorkouts.map((workout) => (
                <div 
                  key={workout.id} 
                  className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition flex justify-between items-center"
                >
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">{workout.name}</h2>
                    <p className="text-sm text-gray-400">{workout.date}</p>
                  </div>
                  <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {workout.duration} dk
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SAĞ TARAF: Chat (%33) */}
        <div className="lg:col-span-1">
           <FitnessChat />
        </div>

      </div>
    </main>
  );
}
