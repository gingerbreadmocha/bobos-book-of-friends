import { useCallback, useMemo, useState, type ReactNode } from "react";
import { AuthModal } from "@/components/auth/auth-modal.tsx";
import {
  UserContext,
  type LoginCredentials,
  type PublicUser,
  type SignUpCredentials,
  type UserContextValue,
} from "@/context/user-context";

/**
 * The server responds to login/signup with a signed JWT plus the public user.
 * Store the token and attach it as `Authorization: Bearer <token>` on
 * authenticated API calls.
 */
type AuthResponse = {
  token: string;
  user: PublicUser;
};

const TOKEN_STORAGE_KEY = "bobo-guestbook-token";
const USER_STORAGE_KEY = "bobo-guestbook-user";

/** POSTs JSON and returns the parsed body, throwing the API's error message on failure. */
async function postJson(path: string, body: unknown): Promise<unknown> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    // Non-JSON response (e.g. a proxy error); fall through to generic text.
  }

  if (!response.ok) {
    const serverError =
      typeof data === "object" && data !== null ? (data as Record<string, unknown>).error : null;
    throw new Error(
      typeof serverError === "string" ? serverError : "Something went wrong. Please try again.",
    );
  }

  return data;
}

function isAuthResponse(value: unknown): value is AuthResponse {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.token === "string" && typeof record.user === "object" && record.user !== null
  );
}

function getTokenExpiry(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64)) as Record<string, unknown>;
    return typeof decoded.exp === "number" ? decoded.exp : null;
  } catch {
    return null;
  }
}

function isTokenValid(token: string): boolean {
  const expiresAt = getTokenExpiry(token);
  return expiresAt === null || expiresAt * 1000 > Date.now();
}

type SessionState = {
  user: PublicUser | null;
  token: string | null;
  isLoading: boolean;
};

/** Reads localStorage and returns the restored session (empty if none/expired). */
function restoreSession(): SessionState {
  const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);

  const clearStoredSession = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  // No persisted session, or the token is missing/expired: sign the user out.
  if (!storedToken || !storedUser || !isTokenValid(storedToken)) {
    clearStoredSession();
    return { user: null, token: null, isLoading: false };
  }

  try {
    return {
      user: JSON.parse(storedUser) as PublicUser,
      token: storedToken,
      isLoading: false,
    };
  } catch {
    // Corrupted cached user JSON: drop it rather than crash.
    clearStoredSession();
    return { user: null, token: null, isLoading: false };
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState>(restoreSession);

  const [showAuthModal, setShowAuthModal] = useState(false);

  const showAuth = useCallback(() => {
    setShowAuthModal(true);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const data = await postJson("/api/login", credentials);
    if (!isAuthResponse(data)) {
      throw new Error("The server returned an unexpected response.");
    }
    setSession({ user: data.user, token: data.token, isLoading: false });
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
  }, []);

  const signup = useCallback(async (credentials: SignUpCredentials) => {
    const data = await postJson("/api/create-account", credentials);
    if (!isAuthResponse(data)) {
      throw new Error("The server returned an unexpected response.");
    }
    setSession({ user: data.user, token: data.token, isLoading: false });
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
  }, []);

  const logout = useCallback(() => {
    setSession({ user: null, token: null, isLoading: false });
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }, []);

  const value = useMemo<UserContextValue>(
    () => ({
      user: session.user,
      token: session.token,
      isLoading: session.isLoading,
      isAuthenticated: session.user !== null && session.token !== null,
      login,
      signup,
      logout,
      showAuth,
    }),
    [session, login, signup, logout, showAuth],
  );

  return (
    <UserContext.Provider value={value}>
      {children}
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </UserContext.Provider>
  );
}
