"use client";

import { useState } from "react";
import { exercises } from "@/data/exercises";

export default function GuidePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Automatically extract categories
  const categories = ["All", ...Array.from(new Set(exercises.map(e => e.category)))];

  // Filtering logic
  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || ex.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Exercise Guide 📚</h1>
          <p className="text-slate-400 mt-1">Improve your form, train without injury.</p>
        </div>
        
        {/* Search Box */}
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Search exercise..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 pl-10 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
          <span className="absolute left-3 top-2.5 text-slate-500">🔍</span>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat 
                ? "bg-emerald-600 text-white" 
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredExercises.map((ex) => (
          <div key={ex.id} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-emerald-500/30 transition-all group flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-slate-800 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-slate-700">
                {ex.category}
              </span>
              <span className={`text-xs px-2 py-1 rounded font-medium ${
                ex.difficulty === "Beginner" ? "text-green-400 bg-green-400/10" :
                ex.difficulty === "Intermediate" ? "text-yellow-400 bg-yellow-400/10" :
                "text-red-400 bg-red-400/10"
              }`}>
                {ex.difficulty === "Başlangıç" ? "Beginner" : 
                 ex.difficulty === "Orta" ? "Intermediate" : "Advanced"}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
              {ex.name}
            </h3>
            
            <p className="text-slate-400 text-sm mb-4 line-clamp-3">
              {ex.description}
            </p>

            <div className="mt-auto pt-4 border-t border-slate-800/50">
              <p className="text-xs text-slate-500 font-semibold mb-2">PRO TIPS:</p>
              <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4 mb-4">
                {ex.tips.map((tip, i) => <li key={i}>{tip}</li>)}
              </ul>
              
              <a 
                href={ex.videoUrl} 
                target="_blank" 
                rel="noreferrer"
                className="block w-full text-center py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors"
              >
                🎥 Watch How To
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}