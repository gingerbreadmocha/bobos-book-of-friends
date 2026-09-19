import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { Cat } from "@/hooks/useGetCats";
import { CatContext, type CatContextValue } from "@/context/cat-context";

export function CatProvider({ children }: { children: ReactNode }) {
  const [activeCat, setActiveCat] = useState<Cat | null>(null);

  const selectCat = useCallback((cat: Cat) => {
    setActiveCat(cat);
  }, []);

  const clearCat = useCallback(() => {
    setActiveCat(null);
  }, []);

  /* Makes sure the context only re-renders when activeCat changes, rather than when the parent component re-renders */
  const value = useMemo<CatContextValue>(
    () => ({ activeCat, selectCat, clearCat }),
    [activeCat, selectCat, clearCat],
  );

  return <CatContext.Provider value={value}>{children}</CatContext.Provider>;
}
