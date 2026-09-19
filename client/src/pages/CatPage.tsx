import { useCat } from "@/context/cat-context";
import { getRandomAvatar } from "@/utils/getRandomAvatar";

export function CatPage() {
  const { activeCat } = useCat();

  const pictureSrc = activeCat?.avatarUrl
    ? activeCat.avatarUrl
    : getRandomAvatar();

  return (
    <section className="w-full max-w-3xl text-center">
      <h1 className="text-3xl font-semibold text-foreground">Cat</h1>
      <p className="mt-3 text-foreground-soft">
        Chat with the cats of Bobo&apos;s book of friends.
      </p>
      <div className="mt-8 rounded-2xl border-2 border-dashed border-input bg-white/60 p-10">
        {activeCat ? (
          <div className="flex flex-col items-center gap-4">
            <img
              src={pictureSrc}
              alt={`${activeCat.name} avatar`}
              className="h-24 w-24 rounded-full object-cover"
            />
            <p className="text-xl font-semibold text-violet-950">
              Chatting with {activeCat.name}
            </p>
            <p className="text-muted-foreground">The chat room is coming soon.</p>
          </div>
        ) : (
          <p className="text-muted-foreground">The chat room is coming soon.</p>
        )}
      </div>
    </section>
  );
}
