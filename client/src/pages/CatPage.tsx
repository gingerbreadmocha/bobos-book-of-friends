import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useGetCat } from "@/hooks/useGetCat";
import { getRandomAvatar } from "@/utils/getRandomAvatar";
import { ChatRoom } from "@/components/chat/chat-room";
import { RecentChats } from "@/components/chat/recent-chats";
import { cn } from "@/lib/utils";

const sanitizedAvatarUrl = (avatarUrl: string) => {
  if (avatarUrl.includes("createCat/avatars") && avatarUrl.charAt(0) !== "/")
    return `/${avatarUrl}`;
  return avatarUrl;
};

export function CatPage() {
  const { catId } = useParams();
  const navigate = useNavigate();
  const { cat, loading, notFound } = useGetCat(catId);

  const pictureSrc = cat?.avatarUrl ? sanitizedAvatarUrl(cat.avatarUrl) : getRandomAvatar();
  const inChat = Boolean(catId);

  return (
    <section className="flex w-full flex-col md:min-h-dvh md:h-dvh">
      <div className="flex flex-col h-full gap-6 md:mt-8 md:flex-row md:rounded-2xl md:border-2 md:border-dashed md:border-input md:bg-white/60 md:p-10">
        {/* On phones the page shows the Recent Chats list until a chat is opened; on
            md+ the list is a persistent sidebar beside the chat. */}
        <div
          className={cn(
            "h-full w-full max-md:h-[calc(100dvh_-_7rem)] md:w-80 md:shrink-0",
            inChat ? "hidden md:block" : "block",
          )}
        >
          <RecentChats activeCatId={catId} />
        </div>

        <div
          className={cn(
            "min-w-0",
            inChat ? "max-md:h-[calc(100dvh_-_7rem)] md:flex-1" : "hidden md:block md:flex-1",
          )}
        >
          <div className="flex h-full flex-col items-stretch text-center">
            {inChat && (
              <div className="flex items-center gap-2 text-left md:hidden">
                <button
                  type="button"
                  onClick={() => navigate("/cat")}
                  aria-label="Back to recent chats"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted focus-visible:outline-none"
                >
                  <ChevronLeft className="size-5" />
                </button>
                {cat && (
                  <>
                    <img
                      src={pictureSrc}
                      alt={`${cat.name} avatar`}
                      className="h-9 w-9 shrink-0 rounded-full object-cover"
                    />
                    <p className="truncate text-lg font-semibold text-foreground">
                      Chatting with {cat.name}
                    </p>
                  </>
                )}
              </div>
            )}

            {cat ? (
              <>
                <img
                  src={pictureSrc}
                  alt={`${cat.name} avatar`}
                  className="mx-auto hidden h-16 w-16 rounded-full object-cover md:block"
                />
                <p className="hidden text-xl font-semibold text-foreground md:block">
                  Chatting with {cat.name}
                </p>
                <div className="mt-4 flex-1 overflow-hidden p-4">
                  <ChatRoom key={cat.id} cat={cat} />
                </div>
              </>
            ) : loading ? (
              <div className="flex h-full items-center justify-center text-center">
                <p className="text-muted-foreground">Loading cat...</p>
              </div>
            ) : notFound ? (
              <div className="flex h-full items-center justify-center text-center">
                <p className="text-muted-foreground">We couldn&apos;t find that cat.</p>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-center">
                <p className="text-muted-foreground">
                  Select a recent chat to pick up where you left off, or find a new cat on Discover.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
