import { useCallback, useState } from "react";
import type { Cat } from "./useGetCats";
import { useUser } from "@/context/user-context";

export type CreateCatInput = {
  name: string;
  avatarUrl: string | null;
  description: string;
  personality: Record<string, unknown>;
};

export function useCreateCat() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useUser();

  const createCat = useCallback(async (newCat: CreateCatInput) => {
    setIsSubmitting(true);
    setError(null);

    if (!user) {
      setError("User must be logged in to create a cat.");
      return;
    }

    const body = {
      ...newCat,
    };
    try {
      const response = await fetch("/api/cats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error ?? "Failed to create cat.");
      }
      return (await response.json()) as Cat;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { createCat, isSubmitting, error };
}
