import { useNavigate } from "react-router-dom";
import type { ChattedCat } from "@/hooks/useGetCatChats";
import { useGetCatChats } from "@/hooks/useGetCatChats";
import { getRandomAvatar } from "@/utils/getRandomAvatar";
import { cn } from "@/lib/utils";

type RecentChatsProps = {
  /** The id of the chat currently displayed in the Chatroom. */
  activeCatId?: string;
  /** Override the default behavior of opening /cat/:id when a chat is picked. */
  onSelectChat?: (cat: ChattedCat) => void;
};

const lastMessageTime = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function RecentChats({ activeCatId, onSelectChat }: RecentChatsProps) {
  const { cats, loading } = useGetCatChats();
  const navigate = useNavigate();

  const handleSelect = (cat: ChattedCat) => {
    if (onSelectChat) {
      onSelectChat(cat);
    } else {
      navigate(`/cat/${cat.id}`);
    }
  };

  return (
    <aside className="flex h-full w-full shrink-0 flex-col overflow-hidden p-4 md:w-80 md:rounded-2xl md:border-2 md:border-border md:bg-white/70">
      <h2 className="px-1 text-sm font-semibold uppercase tracking-wider text-foreground-subtle">
        Recent chats
      </h2>

      {loading ? (
        <p className="px-1 pt-4 text-sm text-muted-foreground" role="status">
          Loading chats...
        </p>
      ) : cats.length === 0 ? (
        <p className="px-1 pt-4 text-sm text-muted-foreground">
          You don&apos;t have any chats yet. Find a cat on Discover to start a conversation.
        </p>
      ) : (
        <ul className="mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
          {cats.map((cat) => {
            const isActive = cat.id === activeCatId;
            const pictureSrc = cat.avatarUrl ? `/${cat.avatarUrl}` : getRandomAvatar();
            return (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(cat)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "border-primary bg-primary/10"
                      : "border-transparent hover:bg-muted active:bg-muted",
                  )}
                >
                  <img
                    src={pictureSrc}
                    alt={`${cat.name} avatar`}
                    className="h-11 w-11 shrink-0 rounded-full object-cover"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {cat.name}
                      </span>
                      <time
                        dateTime={cat.lastMessage.createdAt}
                        className="shrink-0 text-xs text-foreground-subtle"
                      >
                        {lastMessageTime.format(new Date(cat.lastMessage.createdAt))}
                      </time>
                    </span>
                    <span
                      className={cn(
                        "block truncate text-sm",
                        isActive ? "text-foreground-soft" : "text-muted-foreground",
                      )}
                    >
                      {cat.lastMessage.role === "user"
                        ? `You: ${cat.lastMessage.text}`
                        : `${cat.name}: ${cat.lastMessage.text}`}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
