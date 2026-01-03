import { Mistral } from "@mistralai/mistralai";

const apiKey =
	process.env.MISTRAL_API_KEY || "D9rNeecr6Rn9umNhdYOKssAMfsnukzVz";
const client = new Mistral({ apiKey });

export async function sendMessage(prompt: string): Promise<string> {
	try {
		if (!prompt) {
			throw new Error("Prompt boş olamaz");
		}

		const chatResponse = await client.chat.complete({
			model: "mistral-large-latest",
			messages: [
				{
					role: "user",
					content: prompt,
				},
			],
		});

		const content = chatResponse.choices[0]?.message?.content;

		let text: string;
		if (typeof content === "string") {
			text = content;
		} else if (Array.isArray(content)) {
			text = content
				.map((chunk) => {
					if (typeof chunk === "string") return chunk;
					if (chunk && typeof chunk === "object" && "text" in chunk) {
						const chunkWithText = chunk as { text?: string };
						return chunkWithText.text || "";
					}
					return "";
				})
				.filter(Boolean)
				.join("");
		} else {
			throw new Error("Mistral API'den yanıt alınamadı");
		}

		if (!text) {
			throw new Error("Mistral API'den yanıt alınamadı");
		}

		return text;
	} catch (error) {
		console.error("API CRASH:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";

		// Daha detaylı hata mesajı
		if (errorMessage.includes("API_KEY") || errorMessage.includes("401")) {
			throw new Error(
				"Geçersiz API anahtarı. Lütfen API anahtarınızı kontrol edin.",
			);
		} else if (errorMessage.includes("quota") || errorMessage.includes("429")) {
			throw new Error("API kotası aşıldı. Lütfen daha sonra tekrar deneyin.");
		} else if (errorMessage.includes("model")) {
			throw new Error("Model bulunamadı. Model adını kontrol edin.");
		}

		throw new Error(errorMessage);
	}
}

export async function POST(req: Request) {
	try {
		const body = await req.json();

		if (!body?.message) {
			return Response.json({ error: "Missing message" }, { status: 400 });
		}

		const text = await sendMessage(body.message);
		return Response.json({ text });
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";

		return Response.json(
			{
				error: "Internal Server Error",
				details: errorMessage,
			},
			{ status: 500 },
		);
	}
}
