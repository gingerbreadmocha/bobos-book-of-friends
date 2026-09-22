import { useCallback, useEffect, useState } from "react";
import type { ChatMessage } from "@/components/chat/chat-messages";
import { useUser } from "@/context/user-context";
import { API_BASE_URL } from "@/lib/api";
import {
  loadGuestChats,
  saveGuestChat,
  type GuestChatLog,
} from "@/lib/guest-chat-storage";

type ChatResponse = {
  cat: { id: string; name: string };
  reply: string;
};

type HistoryResponse = {
  messages: ChatMessage[];
};

let nextMessageId = 0;
const createMessage = (role: "user" | "cat", text: string): GuestChatLog => ({
  id: `msg-${++nextMessageId}`,
  role,
  text,
  createdAt: new Date().toISOString(),
});

export function useChat(catId: string, catName: string) {
  const { token, isAuthenticated } = useUser();
  // Guests start from whatever was saved locally for this cat.
  const [messages, setMessages] = useState<ChatMessage[]>(
    () => (isAuthenticated ? [] : loadGuestChats()[catName] ?? []),
  );
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    const loadHistory = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/chat/history/${catId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return;
        const data = (await response.json()) as HistoryResponse;
        if (!cancelled) setMessages(data.messages);
      } catch (err) {
        console.error(err instanceof Error ? err.message : "Failed to load chat history.");
      }
    };

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, [catId, token, isAuthenticated]);

  const sendMessage = useCallback(
    async (message: string) => {
      setError(null);
      const userMessages = [...messages, createMessage("user", message)];
      setMessages(userMessages);
      if (!isAuthenticated) saveGuestChat(catName, catId, userMessages);
      setSending(true);

      try {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (isAuthenticated) headers.Authorization = `Bearer ${token}`;

        const response = await fetch(`${API_BASE_URL}/api/chat`, {
          method: "POST",
          headers,
          body: JSON.stringify({ catId, message }),
        });

        if (!response.ok) {
          console.error("Failed to get a reply from the cat.");
          setError("The cat didn't answer. Please try again.");
          return;
        }

        const data = (await response.json()) as ChatResponse;
        const replyMessages = [...userMessages, createMessage("cat", data.reply)];
        setMessages(replyMessages);
        if (!isAuthenticated) saveGuestChat(catName, catId, replyMessages);
      } catch (err) {
        console.error(err instanceof Error ? err.message : "Failed to get a reply from the cat.");
        setError("The cat didn't answer. Please try again.");
      } finally {
        setSending(false);
      }
    },
    [catId, catName, token, isAuthenticated, messages],
  );

  return { messages, sendMessage, sending, error };
}
