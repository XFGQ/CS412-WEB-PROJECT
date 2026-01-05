import { db } from "../../../../db";
import { workoutLogs, nutritionLogs } from "../../../../db/schema";
import { eq, desc } from "drizzle-orm";
import { cookies } from "next/headers";
import FitnessChat from "@/components/FitnessChat";

export default async function StatsPage() {
    const cookieStore = await cookies();
    const userId = Number(cookieStore.get("user_session")?.value);

    // Fetch last 7 records
    const workouts = await db
        .select()
        .from(workoutLogs)
        .where(eq(workoutLogs.userId, userId))
        .orderBy(desc(workoutLogs.id))
        .limit(7);
    const nutrition = await db
        .select()
        .from(nutritionLogs)
        .where(eq(nutritionLogs.userId, userId))
        .orderBy(desc(nutritionLogs.id))
        .limit(7);

    // Prompt for AI evaluation
    const summary = `
Below are the user's latest records.
This data contains up to 7 entries and may not cover exactly 7 days.

YOUR ROLE:
You are an experienced fitness and nutrition coach.
Do not use academic language.
Do not create tables.
Do not perform percentage or mathematical calculations.
Do not make assumptions.
Do not use Markdown or special formatting (like **).

DATA:

WORKOUT RECORDS:
${workouts.map((w, i) => `${i + 1}. ${JSON.stringify(w)}`).join("\n")}

NUTRITION RECORDS:
${nutrition.map((n, i) => `${i + 1}. ${JSON.stringify(n)}`).join("\n")}

YOUR TASK:
- Use only plain text.
- Provide a brief general evaluation.
- Give at most 5 clear suggestions.
- Write a maximum of 6-8 sentences.
`;

    const maxCalories = Math.max(...nutrition.map((n) => n.calories), 2500);

    return (
        <div className="space-y-8 fade-in">
            <h1 className="text-3xl font-bold text-white">Progress Reports 📈</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* --- CALORIE CHART (CSS Bar Chart) --- */}
                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                    <h3 className="font-bold text-white mb-6">
                        Recent Calorie Intake
                    </h3>
                    <div className="h-64 flex items-end justify-between gap-2 px-2">
                        {nutrition.length === 0 ? (
                            <p className="text-slate-500 w-full text-center self-center">
                                No data available
                            </p>
                        ) : (
                            nutrition.map((log, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col items-center gap-2 w-full group"
                                >
                                    <div className="relative w-full flex justify-center">
                                        <span className="absolute -top-8 text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 px-2 py-1 rounded">
                                            {log.calories}
                                        </span>
                                        <div
                                            style={{
                                                height: `${(log.calories / maxCalories) * 200}px`,
                                            }}
                                            className="w-full max-w-[40px] bg-emerald-500/80 rounded-t-lg hover:bg-emerald-400 transition-all min-h-[10px]"
                                        ></div>
                                    </div>
                                    <span className="text-xs text-slate-500 truncate w-16 text-center">
                                        {log.foodName.slice(0, 6)}..
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* --- RECENT WORKOUT DETAILS TABLE --- */}
                <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
                    <h3 className="font-bold text-white mb-6">Workout History</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="text-xs uppercase bg-slate-800/50 text-slate-300">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Date</th>
                                    <th className="px-4 py-3">Activity</th>
                                    <th className="px-4 py-3">Time/Set</th>
                                    <th className="px-4 py-3 rounded-r-lg">Detail</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {workouts.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-4 text-center">
                                            No records found
                                        </td>
                                    </tr>
                                ) : (
                                    workouts.map((w) => (
                                        <tr
                                            key={w.id}
                                            className="hover:bg-slate-800/30 transition-colors"
                                        >
                                            <td className="px-4 py-3">{w.date || "Today"}</td>
                                            <td className="px-4 py-3 font-medium text-white">
                                                {w.notes}
                                            </td>
                                            <td className="px-4 py-3">
                                                {w.durationMinutes
                                                    ? `${w.durationMinutes} min`
                                                    : `${w.sets} x ${w.reps}`}
                                            </td>
                                            <td className="px-4 py-3 text-emerald-400">
                                                {w.weightLifted ? `${w.weightLifted} kg` : "-"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <FitnessChat mode={summary} />
            </div>
        </div>
    );
}