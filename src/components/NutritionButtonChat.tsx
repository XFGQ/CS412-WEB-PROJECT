"use client";

import { useState } from "react";
import DietChat from "@/components/NutritionChat";

export default function DietChatModalButton() {
	const [open, setOpen] = useState(false);

	return (
		<>
			{/* BUTTON */}
			<button
				onClick={() => setOpen(true)}
				className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
			>
				Diet AI
			</button>

			{/* MODAL */}
			{open && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
					<div className="w-full max-w-lg h-[600px] bg-slate-900/80 border border-slate-800 rounded-3xl shadow-2xl flex flex-col">
						{/* HEADER */}
						<div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
							<div className="flex items-center gap-2 text-white font-semibold">
								🤖 AI Diet Chat
							</div>
							<button
								onClick={() => setOpen(false)}
								className="text-slate-400 hover:text-white text-xl"
							>
								✕
							</button>
						</div>

						{/* CHAT BODY */}
						<div className="flex-1 overflow-hidden">
							<DietChat />
						</div>
					</div>
				</div>
			)}
		</>
	);
}
