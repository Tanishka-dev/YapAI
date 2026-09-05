import { addAssistantMessage, getMessages, getHistoryLength } from "../respositories/session.repository";
import Openai from "openai";

const client = new Openai({
    baseURL: "https://router.huggingface.co/v1",
    apiKey: process.env.HUGGING_FACE_API_KEY,
});

type ChatResponse = {
    message: string;
    sessionId: string;
    historyLength: number;
}

export const chatService = {
    sendMessage: async (id: string): Promise<ChatResponse> => {
        const response = await client.chat.completions.create({
            model: "openai/gpt-oss-120b:groq",
            messages: getMessages(id),
            temperature: 0.2,
            max_tokens: 500,
        });

        const assistantMessage = response.choices[0]?.message.content ?? "";
        if (!assistantMessage) {
            throw new Error("No assistant message returned from model");
        }
        addAssistantMessage(id, assistantMessage);
        return {
            message: assistantMessage,
            sessionId: id,
            historyLength: getHistoryLength(id),
        };
    },
};