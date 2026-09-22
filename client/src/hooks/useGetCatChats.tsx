import { useCallback, useEffect, useState } from "react";
import type { Cat } from "./useGetCats";
import { useUser } from "@/context/user-context";
import { getGuestChattedCats } from "@/lib/guest-chat-storage";

export type ChattedCat = Cat & {
  lastMessage: {
    id: string;
    role: "user" | "cat";
    text: string;
    createdAt: string;
  };
};

export type CatChatsResponse = {
  cats: ChattedCat[];
};

/** For not logged in users- grabs their chat from localStorage */
function guestChattedCats(): ChattedCat[] {
  return getGuestChattedCats().map(({ name, id, logs }) => {
    const last = logs[logs.length - 1];
    return {
      id,
      name,
      avatarUrl: null,
      personality: {},
      ownerId: "",
      description: "",
      owner: { id: "", username: "" },
      popularity: 0,
      createdAt: "",
      updatedAt: "",
      lastMessage: {
        id: last.id,
        role: last.role,
        text: last.text,
        createdAt: last.createdAt ?? new Date(0).toISOString(),
      },
    } satisfies ChattedCat;
  });
}

export function useGetCatChats() {
  const [loading, setLoading] = useState(true);
  const [cats, setCats] = useState<ChattedCat[]>([]);
  const { token, isAuthenticated } = useUser();

  const getCatChats = useCallback(async () => {
    if (!isAuthenticated) {
      // Guests see the chats saved locally for this browser.
      setCats(guestChattedCats());
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/cats/chatted", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to load your chats.");
      }

      const data = (await response.json()) as CatChatsResponse;
      setCats(data.cats);
    } catch (err) {
      console.error(err instanceof Error ? err.message : "Failed to load your chats.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  // Load the chats on mount, and re-fetch on every (re)sign-in.
  useEffect(() => {
    const fetchInitialChats = async () => {
      try {
        await getCatChats();
      } catch (err) {
        console.error("Failed to load initial chats:", err);
      }
    };

    fetchInitialChats();
  }, [getCatChats]);

  return { cats, loading };
}
