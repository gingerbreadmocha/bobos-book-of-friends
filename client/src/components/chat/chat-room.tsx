import { useEffect, useRef } from "react";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { useChat } from "@/hooks/useChat";
import type { Cat } from "@/hooks/useGetCats";

export function ChatRoom({ cat }: { cat: Cat }) {
  const { messages, sendMessage, sending, error } = useChat(cat.id);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ChatMessages messages={messages} />
        <div ref={bottomRef} />
      </div>
      {sending && (
        <p className="shrink-0 text-sm text-muted-foreground">{cat.name} is thinking...</p>
      )}
      {error && <p className="shrink-0 text-sm text-destructive">{error}</p>}
      <div className="shrink-0">
        <ChatInput disabled={sending} onSend={sendMessage} />
      </div>
    </div>
  );
}
