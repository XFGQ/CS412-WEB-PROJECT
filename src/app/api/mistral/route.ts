import { Mistral } from "@mistralai/mistralai";

const apiKey = process.env.MISTRAL_API_KEY;

if (!apiKey) {
    throw new Error("MISTRAL_API_KEY not defined");
}

const client = new Mistral({ apiKey });

export async function sendMessage(prompt: string): Promise<string> {
    try {
        if (!prompt) {
            throw new Error("Prompt cannot be empty");
        }

        const chatResponse = await client.chat.complete({
            model: "mistral-large-latest",
            messages: [
                { 
                    role: "system",
                    content:
                        "You are an expert fitness and diet coach. You can only talk about fitness, exercise, nutrition, and diet. Do not answer questions outside of these topics. If an unrelated question is asked, respond only with: 'I cannot help with this topic.' Write your responses in plain, simple text. Do not use Markdown, bolding, italics, stars (*), or bullet points.",
                },
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
            throw new Error("No response received from Mistral API");
        }

        if (!text) {
            throw new Error("No response received from Mistral API");
        }

        return text;
    } catch (error) {
        console.error("API CRASH:", error);
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";

        // Detailed error messages
        if (errorMessage.includes("API_KEY") || errorMessage.includes("401")) {
            throw new Error(
                "Invalid API key. Please check your API configuration.",
            );
        } else if (errorMessage.includes("quota") || errorMessage.includes("429")) {
            throw new Error("API quota exceeded. Please try again later.");
        } else if (errorMessage.includes("model")) {
            throw new Error("Model not found. Please check the model name.");
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