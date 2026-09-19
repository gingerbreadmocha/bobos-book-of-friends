import { useCallback, useState } from "react";
import { useUser } from "@/context/user-context";
import type { Cat, CreateCatInput } from "@/types/cat";

export function useCreateCat() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token, user } = useUser();

  const createCat = useCallback(
    async (newCat: CreateCatInput) => {
      if (!user) {
        throw new Error("You must be logged in to create a cat.");
      }

      setIsSubmitting(true);
      try {
        const response = await fetch("/api/cats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newCat),
        });
        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.error ?? "Failed to create cat.");
        }
        return (await response.json()) as Cat;
      } finally {
        setIsSubmitting(false);
      }
    },
    [token, user],
  );

  return { createCat, isSubmitting };
}
