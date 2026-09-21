import { CatList } from "@/components/discoverCat/catList";

export function DiscoverPage() {
  return (
    <section className="w-full text-center m-auto">
      <div className="flex flex-col justify-center items-center">
        <img src="/discover/discover_cats_tuxedo.png" alt="Cat chat" className="max-h-[200px]" />
        <p className="mt-3 text-foreground-soft">
          Meet new feline friends! Chat with different cats, explore their unique personalities, and
          find your favorites.
        </p>
      </div>
      <div className="mt-8 rounded-2xl border-2 border-dashed border-input bg-white/60 p-10">
        <CatList />
      </div>
    </section>
  );
}
