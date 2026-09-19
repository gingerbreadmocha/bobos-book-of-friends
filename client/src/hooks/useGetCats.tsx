import { useCallback, useEffect, useState } from "react";
import type { Cat, GetCatsResponse } from "@/types/cat";

export function useGetCats() {
  const [loading, setLoading] = useState(true);
  // Keeps track of the cats in discover cats
  const [cats, setCats] = useState<Cat[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const getCats = useCallback(async (page: number) => {
    try {
      const response = await fetch(`/api/cats?page=${page}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to load cats.");
      }

      const data = (await response.json()) as GetCatsResponse;
      // Page 1 replaces the list; later pages append for infinite scroll.
      setCats((prevCats) =>
        page === 1 ? data.cats : [...prevCats, ...data.cats],
      );
      setCurrentPage(page);
      setHasMore(data.pagination.hasNext);
    } catch (err) {
      console.error(
        err instanceof Error ? err.message : "Failed to load cats.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Load the first page on mount.
  useEffect(() => {
    const fetchInitialCats = async () => {
      try {
        await getCats(1);
      } catch (err) {
        console.error("Failed to load initial cats:", err);
      }
    };

    fetchInitialCats();
  }, [getCats]);

  const loadMore = useCallback(async () => {
    setLoading(true);

    try {
      await getCats(currentPage + 1);
    } catch (err) {
      console.error("Failed to load more cats: ", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, getCats]);

  return { cats, loading, hasMore, loadMore };
}
