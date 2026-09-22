import { useEffect, useState } from "react";
import type { Cat } from "@/hooks/useGetCats";
import { API_BASE_URL } from "@/lib/api";

export function useGetCat(catId: string | undefined) {
  const [cat, setCat] = useState<Cat | null>(null);
  const [failedId, setFailedId] = useState<string | null>(null);

  useEffect(() => {
    if (!catId) return;

    const fetchCat = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/cats/${catId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          setCat(null);
          setFailedId(catId);
          return;
        }

        const data = (await response.json()) as Cat;
        setCat(data);
        setFailedId(null);
      } catch (err) {
        console.error(err instanceof Error ? err.message : "Failed to load the cat.");
        setCat(null);
        setFailedId(catId);
      }
    };

    const loadCat = async () => {
      await fetchCat();
    };

    loadCat();
  }, [catId]);

  return {
    // Only expose the cat that matches the current URL param so a stale
    // result from a previous param is never rendered.
    cat: cat?.id === catId ? cat : null,
    loading: Boolean(catId) && cat?.id !== catId && failedId !== catId,
    notFound: failedId === catId,
  };
}
