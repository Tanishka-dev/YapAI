export type ChatMessage = {
    role: "user" | "assistant" | "system";
    content: string;
};

const SYSTEM_PROMPT =
    "You are a helpful assistant. Remember what the user has told you during this conversation.";

// Per-session history: sessionId -> messages
const sessions: Record<string, ChatMessage[]> = {};

export function ensureSession(id: string): ChatMessage[] {
    const existing = sessions[id];
    if (existing) {
        return existing;
    }

    const created: ChatMessage[] = [{ role: "system", content: SYSTEM_PROMPT }];
    sessions[id] = created;
    return created;
}

export function getMessages(id: string): ChatMessage[] {
    return ensureSession(id);
}

export function addUserMessage(id: string, prompt: string): void {
    ensureSession(id).push({ role: "user", content: prompt });
}

export function addAssistantMessage(id: string, content: string): void {
    ensureSession(id).push({ role: "assistant", content });
}

export function getHistoryLength(id: string): number {
    return getMessages(id).length;
}
