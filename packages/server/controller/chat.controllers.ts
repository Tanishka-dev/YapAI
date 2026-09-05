import type { Request, Response } from "express";
import { chatService } from "../services/chat.service.ts";
import z from "zod";
import { addUserMessage } from "../respositories/session.repository.ts";

const chatSchema = z.object({
    prompt: z
        .string()
        .trim()
        .min(1, "Prompt is required")
        .max(1000, "Prompt must be less than 1000 characters"),
    sessionId: z.string().optional(),
});
export const chatController = {
    sendMessage: async (req: Request, res: Response) => {
        const parseResult = chatSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ error: parseResult.error.message });
        }
        const { prompt, sessionId } = parseResult.data;
        const id = sessionId ?? "default";
        addUserMessage(id, prompt);
        const response = await chatService.sendMessage(id);
        res.json(response);
    }
}