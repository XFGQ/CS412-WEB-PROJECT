"use client";

import { useState } from "react";
import { X } from "lucide-react";
import FitnessChat from "./FitnessChat";

export default function NutritionChatModal() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			{/* Buton */}
			<button
				onClick={() => setIsOpen(true)}
				className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition flex items-center gap-2"
			>
				💬 AI Nutrition Assistant
			</button>

			{/* Modal */}
			{isOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl">
						{/* Modal Header */}
						<div className="flex items-center justify-between p-4 border-b border-gray-200">
							<h2 className="text-xl font-bold text-gray-800">
								Nutrition AI Assistant
							</h2>
							<button
								onClick={() => setIsOpen(false)}
								className="p-2 hover:bg-gray-100 rounded-full transition"
							>
								<X size={24} className="text-gray-600" />
							</button>
						</div>

						{/* Chat Component */}
						<div className="flex-1 overflow-hidden">{/*<FitnessChat /> */}</div>
					</div>
				</div>
			)}
		</>
	);
}

