import { useEffect, useMemo, useState, type ReactNode } from "react";
import { API_BASE_URL } from "@/lib/api";
import { HeartbeatContext, type HeartbeatContextValue } from "@/context/heartbeat-context";

/** How long to wait between probes while the server is still starting up. */
const HEARTBEAT_INTERVAL_MS = 5000;

/**
 * Probes the server's heartbeat endpoint on mount and keeps retrying until it
 * answers, so pages can gate their API calls on `useHeartbeat().isServerReady`.
 */
export function HeartbeatProvider({ children }: { children: ReactNode }) {
  const [isServerReady, setIsServerReady] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const probe = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/heartbeat`, {
          cache: "no-store",
        });
        if (cancelled) return;
        setIsServerReady(response.ok);
        if (response.ok) {
          setIsChecking(false);
          window.clearInterval(intervalId);
        }
      } catch {
        // Server not reachable yet; the next interval tick retries.
        if (!cancelled) setIsServerReady(false);
      }
    };

    const intervalId = window.setInterval(probe, HEARTBEAT_INTERVAL_MS);
    void probe();

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  const value = useMemo<HeartbeatContextValue>(
    () => ({ isServerReady, isChecking }),
    [isServerReady, isChecking],
  );

  return <HeartbeatContext.Provider value={value}>{children}</HeartbeatContext.Provider>;
}
