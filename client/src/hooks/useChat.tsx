import { useCallback, useEffect, useState } from "react";
import type { ChatMessage } from "@/components/chat/chat-messages";
import { useUser } from "@/context/user-context";

type ChatResponse = {
  cat: { id: string; name: string };
  reply: string;
};

type HistoryResponse = {
  messages: ChatMessage[];
};

let nextMessageId = 0;
const createMessageId = () => `msg-${++nextMessageId}`;

export function useChat(catId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useUser();

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const loadHistory = async () => {
      try {
        const response = await fetch(`/api/chat/history/${catId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return;
        const data = (await response.json()) as HistoryResponse;
        if (!cancelled) setMessages(data.messages);
      } catch (err) {
        console.error(
          err instanceof Error ? err.message : "Failed to load chat history.",
        );
      }
    };

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, [catId, token]);

  const sendMessage = useCallback(
    async (message: string) => {
      setError(null);
      setMessages((prev) => [
        ...prev,
        { id: createMessageId(), role: "user", text: message },
      ]);
      setSending(true);

      try {
        if (!token) {
          setError("Sign in to chat with your cat.");
          return;
        }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ catId, message }),
      });

      if (!response.ok) {
        console.error("Failed to get a reply from the cat.");
        setError("The cat didn't answer. Please try again.");
        return;
      }

      const data = (await response.json()) as ChatResponse;
      setMessages((prev) => [
        ...prev,
        { id: createMessageId(), role: "cat", text: data.reply },
      ]);
    } catch (err) {
      console.error(
        err instanceof Error ? err.message : "Failed to get a reply from the cat.",
      );
      setError("The cat didn't answer. Please try again.");
    } finally {
      setSending(false);
    }
  },
  [catId, token]);

  return { messages, sendMessage, sending, error };
}
