import { createContext, useContext } from "react";

export type HeartbeatContextValue = {
  /** True once the server has answered the heartbeat endpoint successfully. */
  isServerReady: boolean;
  /** True while still waiting for the first successful heartbeat. */
  isChecking: boolean;
};

export const HeartbeatContext = createContext<HeartbeatContextValue | null>(null);

export function useHeartbeat(): HeartbeatContextValue {
  const context = useContext(HeartbeatContext);
  if (!context) {
    throw new Error("useHeartbeat must be used within a <HeartbeatProvider>.");
  }
  return context;
}
