import { CatList } from "@/components/discoverCat/catList";
import { useHeartbeat } from "@/context/heartbeat-context";

export function DiscoverPage() {
  const { isServerReady } = useHeartbeat();
  return (
    <section className="w-full text-center m-auto">
      <div className="flex flex-col justify-center items-center">
        <img src="/discover/discover_cats_tuxedo.png" alt="Cat chat" className="max-h-[200px]" />
        <p className="mt-3 text-foreground-soft">
          Meet new feline friends! Chat with different cats, explore their unique personalities, and
          find your favorites.
        </p>
      </div>
      <div className="mt-8 mx-4 md:mx-auto rounded-2xl border-2 border-dashed border-input bg-white/60 p-10 max-w-7xl">
        {!isServerReady ? (
          <div className="flex justify-center text-center items-center m-auto">
            <p>Please wait! The cats just heard the crunchies alarm. They're on their way! </p>
          </div>
        ) : (
          <CatList />
        )}
      </div>
    </section>
  );
}
