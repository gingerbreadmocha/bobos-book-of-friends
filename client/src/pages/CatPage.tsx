import { useParams } from "react-router-dom";
import { useGetCat } from "@/hooks/useGetCat";
import { getRandomAvatar } from "@/utils/getRandomAvatar";
import { ChatRoom } from "@/components/chat/chat-room";

export function CatPage() {
  const { catId } = useParams();
  // The URL param is the single source of truth, so /cat/:id works from a
  // direct link or refresh as well as in-app navigation.
  const { cat, loading, notFound } = useGetCat(catId);

  const pictureSrc = cat?.avatarUrl ? cat.avatarUrl : getRandomAvatar();

  return (
    <section className="w-full max-w-3xl text-center">
      <h1 className="text-3xl font-semibold text-foreground">Cat</h1>
      <p className="mt-3 text-foreground-soft">
        Chat with the cats of Bobo&apos;s book of friends.
      </p>
      <div className="mt-8 rounded-2xl border-2 border-dashed border-input bg-white/60 p-10">
        {cat ? (
          <div className="flex h-[28rem] flex-col items-stretch">
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
          <p className="text-muted-foreground">Loading cat...</p>
        ) : notFound ? (
          <p className="text-muted-foreground">We couldn&apos;t find that cat.</p>
        ) : (
          <p className="text-muted-foreground">
            Pick a cat from discover or your cats to start chatting.
          </p>
        )}
      </div>
    </section>
  );
}
