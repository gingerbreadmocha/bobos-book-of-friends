export type ChatMessage = {
  id: string;
  role: "user" | "cat";
  text: string;
};

export function ChatMessages({ messages }: { messages: ChatMessage[] }) {
  return (
    <div className="flex flex-col gap-3 px-1 py-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={
            message.role === "user" ? "flex justify-end" : "flex justify-start"
          }
        >
          <p
            className={
              message.role === "user"
                ? "max-w-[75%] rounded-2xl bg-primary px-3 py-2 text-sm text-primary-foreground"
                : "max-w-[75%] rounded-2xl bg-muted px-3 py-2 text-sm text-foreground"
            }
          >
            {message.text}
          </p>
        </div>
      ))}
    </div>
  );
}
