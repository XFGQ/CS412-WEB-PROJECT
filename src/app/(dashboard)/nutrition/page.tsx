import { db } from "../../../../db";
import { nutritionLogs } from "../../../../db/schema";
import { addMeal } from "@/actions";
import { desc } from "drizzle-orm";
import NutritionChatModal from "@/components/NutritionButtonChat";

export default async function NutritionPage() {
    const meals = await db
        .select()
        .from(nutritionLogs)
        .orderBy(desc(nutritionLogs.id));

    return (
        <div className="space-y-8 fade-in px-6 py-4">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Nutrition 🍽️</h1>
                    <p className="text-slate-400 mt-1">
                        Track your meals and calories.
                    </p>
                </div>

                <NutritionChatModal />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- LEFT: RECORDS --- */}
                <div className="lg:col-span-2 space-y-4">
                    {meals.length === 0 ? (
                        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-10 text-center">
                            <span className="text-4xl">🥗</span>
                            <h3 className="text-white font-bold mt-4">
                                No meals added yet
                            </h3>
                            <p className="text-slate-500 text-sm mt-2">
                                Add your first meal from the right!
                            </p>
                        </div>
                    ) : (
                        meals.map((meal) => (
                            <div
                                key={meal.id}
                                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">
                                            {meal.foodName}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {meal.mealType ?? "Meal"}
                                            {" · "}
                                            {meal.date}
                                        </p>
                                    </div>

                                    <div className="bg-slate-800 px-3 py-1 rounded-lg text-xs text-slate-300 border border-slate-700">
                                        {meal.calories} kcal
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-white font-bold">{meal.protein} g</p>
                                        <span className="text-xs text-slate-500">Protein</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">{meal.carbs} g</p>
                                        <span className="text-xs text-slate-500">Carbs</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">{meal.fats} g</p>
                                        <span className="text-xs text-slate-500">Fat</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* --- RIGHT: ADD FORM --- */}
                <div className="h-fit sticky top-24">
                    <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 border border-slate-700 p-6 rounded-2xl backdrop-blur-md shadow-xl">
                        <h3 className="font-bold text-xl text-white mb-6 flex items-center gap-2">
                            <span className="bg-emerald-500 w-1 h-6 rounded-full"></span>
                            Add Meal
                        </h3>

                        <form action={addMeal} className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 font-medium ml-1">
                                    Food Name
                                </label>
                                <input
                                    name="foodName"
                                    required
                                    placeholder="e.g. Chicken & Rice"
                                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 font-medium ml-1">
                                    Calories (kcal)
                                </label>
                                <input
                                    name="calories"
                                    type="number"
                                    required
                                    placeholder="650"
                                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 font-medium ml-1">
                                    Meal Type
                                </label>
                                <select
                                    name="mealType"
                                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white"
                                >
                                    <option value="">Select</option>
                                    <option value="Breakfast">Breakfast</option>
                                    <option value="Lunch">Lunch</option>
                                    <option value="Dinner">Dinner</option>
                                    <option value="Snack">Snack</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <input
                                    name="protein"
                                    type="number"
                                    step="0.1"
                                    placeholder="Protein (g)"
                                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                                />
                                <input
                                    name="carbs"
                                    type="number"
                                    step="0.1"
                                    placeholder="Carbs (g)"
                                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                                />
                                <input
                                    name="fats"
                                    type="number"
                                    step="0.1"
                                    placeholder="Fat (g)"
                                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all"
                            >
                                Save Meal
                            </button>

                            <p className="text-xs text-center text-slate-500">
                                Macros are optional, date is set automatically.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}