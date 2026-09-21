import { useCallback, useEffect, useState } from "react";

export type Cat = {
  id: string;
  name: string;
  avatarUrl: string | null;
  personality: Record<string, unknown>;
  ownerId: string;
  description: string;
  owner: { id: string; username: string };
  popularity: number;
  createdAt: string;
  updatedAt: string;
};

export type GetCatsResponse = {
  cats: Cat[];
  pagination: {
    page: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

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
      setCats((prevCats) => (page === 1 ? data.cats : [...prevCats, ...data.cats]));
      setCurrentPage(page);
      setHasMore(data.pagination.hasNext);
    } catch (err) {
      console.error(err instanceof Error ? err.message : "Failed to load cats.");
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
