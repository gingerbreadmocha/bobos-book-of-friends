import { useState } from "react";
import { useMyGetCats } from "@/hooks/useMyGetCats";
import type { Cat } from "@/hooks/useGetCats";
import { ProfileCard } from "@/components/discoverCat/profileCard";
import { CatDetailSidebar } from "@/components/discoverCat/catDetailSidebar";

export function MyCatsPage() {
  const { cats, loading } = useMyGetCats();

  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSelectCat = (cat: Cat) => {
    setSelectedCat(cat);
    setSidebarOpen(true);
  };

  return (
    <section className="w-full text-center">
      <div className="flex flex-col justify-center items-center">
        <img
          src="/myCats/my_cats.png"
          alt="Create cat title"
          className="max-h-[200px]"
        />
        <p className="mt-3 text-foreground-soft">
          The cats you have adopted and can chat with.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border-2 border-dashed border-input bg-white/60 p-10">
        {loading && <p>Please wait! Your cats are on the way. </p>}
        {!loading && cats.length > 0 && (
          <ul className="grid gap-6 sm:grid-cols-2">
            {cats.map((cat) => (
              <li key={cat.id}>
                <ProfileCard cat={cat} onSelect={handleSelectCat} />
              </li>
            ))}
          </ul>
        )}
        {!loading && cats.length === 0 && (
          <p>You haven&apos;t adopted any cats yet.</p>
        )}
      </div>

      <CatDetailSidebar
        cat={selectedCat}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </section>
  );
}
