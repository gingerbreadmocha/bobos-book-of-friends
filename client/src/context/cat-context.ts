import { createContext, useContext } from "react";
import type { Cat } from "@/hooks/useGetCats";

export type CatContextValue = {
  /** The cat the user is currently chatting with, or null when none selected. */
  activeCat: Cat | null;
  /** Saves the cat to chat with (see the "Chat with ..." buttons). */
  selectCat: (cat: Cat) => void;
  /** Clears the selected cat. */
  clearCat: () => void;
};

export const CatContext = createContext<CatContextValue | null>(null);

export function useCat(): CatContextValue {
  const context = useContext(CatContext);
  if (!context) {
    throw new Error("useCat must be used within a <CatProvider>.");
  }
  return context;
}
