import { useParams } from "react-router-dom";
import { useGetCat } from "@/hooks/useGetCat";
import { getRandomAvatar } from "@/utils/getRandomAvatar";
import { ChatRoom } from "@/components/chat/chat-room";
import { RecentChats } from "@/components/chat/recent-chats";

export function CatPage() {
  const { catId } = useParams();
  const { cat, loading, notFound } = useGetCat(catId);

  const pictureSrc = cat?.avatarUrl ? cat.avatarUrl : getRandomAvatar();

  return (
    <section className="w-full min-h-dvh h-dvh flex flex-col">
      <div className="mt-8 flex flex-col gap-6 rounded-2xl border-2 border-dashed border-input bg-white/60 p-6 md:flex-row md:p-10 h-full">
        <RecentChats activeCatId={catId} />

        <div className="min-w-0 flex-1">
          {cat ? (
            <div className="flex h-[28rem] flex-col items-stretch text-center h-full">
              <img
                src={pictureSrc}
                alt={`${cat.name} avatar`}
                className="mx-auto h-16 w-16 rounded-full object-cover"
              />
              <p className="text-xl font-semibold text-foreground">Chatting with {cat.name}</p>
              <div className="mt-4 flex-1 overflow-hidden">
                <ChatRoom key={cat.id} cat={cat} />
              </div>
            </div>
          ) : loading ? (
            <div className="flex h-[28rem] items-center justify-center text-center">
              <p className="text-muted-foreground">Loading cat...</p>
            </div>
          ) : notFound ? (
            <div className="flex h-[28rem] items-center justify-center text-center">
              <p className="text-muted-foreground">We couldn&apos;t find that cat.</p>
            </div>
          ) : (
            <div className="flex h-[28rem] items-center justify-center text-center">
              <p className="text-muted-foreground">
                Select a recent chat to pick up where you left off, or find a new cat on Discover.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
