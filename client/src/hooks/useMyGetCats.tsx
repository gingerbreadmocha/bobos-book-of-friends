import { useCallback, useEffect, useState } from "react";
import { useUser } from "@/context/user-context";
import type { Cat, MyCatsResponse } from "@/types/cat";

export function useMyGetCats() {
  const [loading, setLoading] = useState(true);
  const [cats, setCats] = useState<Cat[]>([]);
  const { token, isAuthenticated } = useUser();

  const getMyCats = useCallback(async () => {
    if (!isAuthenticated) {
      // Not signed in yet, or signed out — clear and stay idle.
      setCats([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/my-cats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to load your cats.");
      }

      const data = (await response.json()) as MyCatsResponse;
      setCats(data.cats);
    } catch (err) {
      console.error(
        err instanceof Error ? err.message : "Failed to load your cats.",
      );
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  // Load the cats on mount, and re-fetch on every (re)sign-in.
  useEffect(() => {
    const fetchInitialCats = async () => {
      try {
        await getMyCats();
      } catch (err) {
        console.error("Failed to load initial cats:", err);
      }
    };

    fetchInitialCats();
  }, [getMyCats]);

  return { cats, loading };
}
