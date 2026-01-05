import { db } from "../../../db";
import { nutritionLogs, workoutLogs, users } from "../../..//db/schema";
import { eq, desc } from "drizzle-orm";
import { cookies } from "next/headers";
import { logoutAction } from "@/actions";

// Card Component
function StatCard({ title, value, unit, icon, color, bg }: any) {
  return (
    <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${bg} ${color}`}>{icon}</div>
      </div>
      <h4 className="text-slate-400 text-sm font-medium">{title}</h4>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-2xl font-bold text-white">{value}</span>
        <span className="text-xs text-slate-500 font-medium">{unit}</span>
      </div>
    </div>
  );
}

export default async function Dashboard() {
  const cookieStore = await cookies();
  const userId = Number(cookieStore.get("user_session")?.value);
  
  const user = await db.select().from(users).where(eq(users.id, userId)).get();
  const nutrition = await db.select().from(nutritionLogs).where(eq(nutritionLogs.userId, userId));
  const workouts = await db.select().from(workoutLogs).where(eq(workoutLogs.userId, userId)).orderBy(desc(workoutLogs.id)).limit(3);

  const totalCalories = nutrition.reduce((acc, curr) => acc + curr.calories, 0);
  const calorieGoal = user?.dailyCalorieGoal || 2000;
  const remainingCalories = calorieGoal - totalCalories;

  return (
    <div className="space-y-8 fade-in">
      
      {/* Top Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900/50 to-slate-900 border border-emerald-500/20 rounded-3xl p-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Hello, {user?.fullName.split(' ')[0]}! 👋</h1>
          <p className="text-slate-300">You need to consume <span className="font-bold text-emerald-400">{remainingCalories > 0 ? remainingCalories : 0} kcal</span> more to reach your goal today.</p>
        </div>
        <form action={logoutAction}>
           <button className="bg-slate-800 border border-slate-700 text-slate-300 px-4 py-2 rounded-xl text-sm hover:bg-slate-700 transition-colors">Logout</button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Calories Taken" value={totalCalories} unit={`/ ${calorieGoal}`} icon="🔥" color="text-orange-400" bg="bg-orange-400/10" />
        <StatCard title="Total Workouts" value={workouts.length} unit="Total" icon="💪" color="text-emerald-400" bg="bg-emerald-400/10" />
        <StatCard title="Current Weight" value={user?.weight || "-"} unit="kg" icon="⚖️" color="text-blue-400" bg="bg-blue-400/10" />
        <StatCard title="Goal Weight" value={user?.goalWeight || "-"} unit="kg" icon="🎯" color="text-purple-400" bg="bg-purple-400/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities List */}
        <div className="lg:col-span-2 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
           <h3 className="font-bold text-white mb-4 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Recent Activities
           </h3>
           <div className="space-y-3">
             {workouts.length === 0 ? <p className="text-slate-500 text-sm">No workout records yet.</p> : 
               workouts.map((w) => (
               <div key={w.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl hover:bg-slate-800/60 transition-colors">
                 <div className="flex items-center gap-3">
                   <div className="bg-slate-800 p-2 rounded-lg text-xl">🏃‍♂️</div>
                   <div>
                     <p className="font-medium text-white">{w.notes}</p>
                     <p className="text-xs text-slate-500">{w.date || "Today"}</p>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-emerald-400 font-bold text-sm">
                     {w.durationMinutes ? `${w.durationMinutes} min` : `${w.weightLifted} kg`}
                   </p>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Tips / Reminders */}
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-blue-900/20 to-slate-900/50 p-6 rounded-2xl border border-blue-500/20">
             <h3 className="font-bold text-blue-400 mb-2">💧 Water Reminder</h3>
             <p className="text-sm text-slate-400 mb-4">Don't forget to drink at least 2.5 liters of water daily. Hydration is key for performance.</p>
             <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 w-[60%] h-full"></div>
             </div>
             <p className="text-right text-xs text-blue-400 mt-1">60% Completed</p>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-white mb-2">Next Target</h3>
            <p className="text-sm text-slate-400">Tomorrow is leg day! Get good rest to break your squat record.</p>
          </div>
        </div>
      </div>
    </div>
  );
}