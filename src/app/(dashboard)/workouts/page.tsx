import { db } from "../../../../db";
import { workoutLogs } from "../../../../db/schema";
import { addWorkout } from "@/actions";
import { desc } from "drizzle-orm";

export default async function WorkoutsPage() {
  // Fetch workout data from database (Newest to oldest)
  const workouts = await db.select().from(workoutLogs).orderBy(desc(workoutLogs.id));

  return (
    <div className="space-y-8 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">My Workouts 💪</h1>
          <p className="text-slate-400 mt-1">Track your progress, push your limits.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT SIDE LIST --- */}
        <div className="lg:col-span-2 space-y-4">
          {workouts.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-10 text-center">
              <span className="text-4xl">📭</span>
              <h3 className="text-white font-bold mt-4">No records yet</h3>
              <p className="text-slate-500 text-sm mt-2">Add your first workout using the form on the right!</p>
            </div>
          ) : (
            workouts.map((workout) => (
              <div key={workout.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all group">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {workout.notes || "Workout"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {workout.date ? new Date(workout.date).toLocaleDateString('en-US') : "No Date"}
                    </p>
                  </div>
                  <div className="bg-slate-800 px-3 py-1 rounded-lg text-xs text-slate-300 border border-slate-700">
                    {workout.durationMinutes && workout.durationMinutes > 0 ? "Cardio / Timed" : "Weights"}
                  </div>
                </div>

                <div className="mt-4 flex gap-4 text-sm">
                  {/* Show if weight data exists */}
                  {workout.weightLifted && workout.weightLifted > 0 && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-lg">🏋️‍♂️</span>
                      <div>
                        <p className="font-bold text-white">{workout.weightLifted} kg</p>
                        <span className="text-xs text-slate-500">{workout.sets} Sets x {workout.reps} Reps</span>
                      </div>
                    </div>
                  )}

                  {/* Show if duration data exists */}
                  {workout.durationMinutes && workout.durationMinutes > 0 && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <span className="text-lg">⏱️</span>
                      <div>
                        <p className="font-bold text-white">{workout.durationMinutes} min</p>
                        <span className="text-xs text-slate-500">Duration</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- RIGHT SIDE ADD FORM --- */}
        <div className="h-fit sticky top-24">
          <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 border border-slate-700 p-6 rounded-2xl backdrop-blur-md shadow-xl">
            <h3 className="font-bold text-xl text-white mb-6 flex items-center gap-2">
              <span className="bg-emerald-500 w-1 h-6 rounded-full"></span>
              Add Record
            </h3>
            
            <form action={addWorkout} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 font-medium ml-1">Workout Name</label>
                <input 
                  name="title" 
                  required 
                  placeholder="e.g. Bench Press or Running" 
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-600" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-medium ml-1">Duration (min)</label>
                  <input name="duration" type="number" placeholder="0" className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium ml-1">Weight (kg)</label>
                  <input name="weight" type="number" placeholder="0" className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium ml-1">Sets</label>
                  <input name="sets" type="number" placeholder="3" className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-medium ml-1">Reps</label>
                  <input name="reps" type="number" placeholder="10" className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-emerald-500 outline-none" />
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-900/20 transform hover:scale-[1.02] mt-2">
                Save Workout
              </button>
              <p className="text-xs text-center text-slate-500">
                You don't have to fill all fields.
              </p>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}