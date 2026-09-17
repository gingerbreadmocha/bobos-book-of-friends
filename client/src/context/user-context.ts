import { createContext, useContext } from "react";

/**
 * This module must stay free of component exports.
 *
 * `createContext` is only safe across a Vite HMR update while there is exactly
 * one module instance holding it. As soon as a module that creates a context
 * has been hot-updated once, Vite rewrites every later import of it to
 * `<file>?t=<timestamp>` (vite:import-analysis), which is a *second* ES module
 * instance with its own `createContext()` result. Consumers that were
 * re-imported then read that new object while the already-mounted
 * `UserProvider` still provides the old one, so `useContext` falls back to the
 * `null` default and `useUser` throws "must be used within a <UserProvider>".
 *
 * Keeping the context object here — and `UserProvider` in its own file — means
 * editing the provider (or any consumer) never recreates this object.
 */

/**
 * The shape of the user the server returns (see the server's `toPublicUser`).
 * `createdAt` arrives as an ISO string after the JSON round-trip.
 */
export type PublicUser = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
};

/** Credentials accepted by POST /api/login. */
export type LoginCredentials =
  | { email: string; password: string }
  | { username: string; password: string };

/** Credentials accepted by POST /api/create-account. */
export type SignUpCredentials = {
  username: string;
  email: string;
  password: string;
};

export type UserContextValue = {
  /** The signed-in user, or null when signed out. */
  user: PublicUser | null;
  /** The session JWT, or null when signed out. */
  token: string | null;
  /** True while the persisted session is being restored on first mount. */
  isLoading: boolean;
  /** Whether the user is signed in with a valid token. */
  isAuthenticated: boolean;
  /** Signs in with an existing account. Rejects with the server's error message. */
  login: (credentials: LoginCredentials) => Promise<void>;
  /** Creates an account, then signs into it. Rejects with the server's message. */
  signup: (credentials: SignUpCredentials) => Promise<void>;
  /** Clears the session on the client. */
  logout: () => void;
  /** Opens the auth modal. Render the trigger only while signed out. */
  showAuth: () => void;
};

export const UserContext = createContext<UserContextValue | null>(null);

export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a <UserProvider>.");
  }
  return context;
}
