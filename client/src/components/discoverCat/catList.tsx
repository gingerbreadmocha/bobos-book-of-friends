import { useEffect, useRef, useState } from "react";
import { useGetCats, type Cat } from "@/hooks/useGetCats";
import { ProfileCard } from "@/components/discoverCat/profileCard";
import { CatDetailSidebar } from "@/components/discoverCat/catDetailSidebar";

export const CatList = () => {
  const { cats, loading, hasMore, loadMore } = useGetCats();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Which cat's detail sidebar is on screen. `selectedCat` is kept while the
  // panel is closing so the exit animation still has content to show.
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadingRef = useRef(loading);
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver((entries) => {
      const isVisible = entries[0]?.isIntersecting;
      if (isVisible && hasMore && !loadingRef.current) {
        loadingRef.current = true;
        loadMore().finally(() => {
          loadingRef.current = false;
        });
      }
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  const handleSelectCat = (cat: Cat) => {
    setSelectedCat(cat);
    setSidebarOpen(true);
  };

  return (
    <>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cats.map((cat) => (
          <li key={cat.id}>
            <ProfileCard cat={cat} onSelect={handleSelectCat} />
          </li>
        ))}
      </ul>

      {/* Invisible sentinel at the end of the grid; the observer above fetches
          the next page as soon as it scrolls into view. `h-px` gives it area so
          IntersectionObserver can actually report it as intersecting. */}
      <div ref={sentinelRef} aria-hidden="true" className="h-px" />

      {loading && (
        <p className="mt-8 text-violet-700" role="status">
          {cats.length === 0 ? "Loading cats..." : "Loading more cats..."}
        </p>
      )}
      {!loading && !hasMore && cats.length > 0 && (
        <p className="mt-8 text-violet-500">
          You&apos;ve reached the end of the cat library!
        </p>
      )}

      <CatDetailSidebar
        cat={selectedCat}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
    </>
  );
};
