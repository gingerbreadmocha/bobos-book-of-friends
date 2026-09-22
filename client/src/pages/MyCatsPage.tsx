import { useState } from "react";
import { useMyGetCats } from "@/hooks/useMyGetCats";
import type { Cat } from "@/hooks/useGetCats";
import { ProfileCard } from "@/components/discoverCat/profileCard";
import { CatDetailSidebar } from "@/components/discoverCat/catDetailSidebar";
import { useHeartbeat } from "@/context/heartbeat-context";

export function MyCatsPage() {
  const { cats, loading } = useMyGetCats();
  const { isServerReady } = useHeartbeat();

  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSelectCat = (cat: Cat) => {
    setSelectedCat(cat);
    setSidebarOpen(true);
  };

  return (
    <section className="w-full text-center">
      <div className="flex flex-col justify-center items-center">
        <img src="/myCats/my_cats.png" alt="Create cat title" className="max-h-[200px]" />
        <p className="mt-3 text-foreground-soft">The cats you have adopted and can chat with.</p>
      </div>

      <div className="mt-8 mx-4 md:mx-auto rounded-2xl border-2 border-dashed border-input bg-white/60 p-10 max-w-7xl">
        {(loading || !isServerReady) && (
          <div className="flex justify-center text-center items-center m-auto">
            <p>Please wait! The cats just heard the crunchies alarm. They're on their way! </p>
          </div>
        )}
        {!loading && isServerReady && cats.length > 0 && (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cats.map((cat) => (
              <li key={cat.id}>
                <ProfileCard cat={cat} onSelect={handleSelectCat} />
              </li>
            ))}
          </ul>
        )}
        {!loading && cats.length === 0 && <p>You haven&apos;t adopted any cats yet.</p>}
      </div>

      <CatDetailSidebar
        cat={selectedCat}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </section>
  );
}
