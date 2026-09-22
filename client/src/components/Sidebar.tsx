import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import { LockIcon } from "lucide-react";
import { useUser } from "@/context/user-context";
import { Button } from "@/components/ui/button";

function navLinkClass(
  isActive: boolean,
  { compact = false, locked = false }: { compact?: boolean; locked?: boolean } = {},
) {
  if (locked) {
    return [
      compact
        ? "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-sm transition-colors duration-150 outline-none whitespace-nowrap"
        : "flex items-center px-4 py-2.5 rounded-lg font-medium transition-colors duration-150 outline-none",
      "text-muted-foreground hover:bg-sidebar focus:bg-sidebar-accent",
    ].join(" ");
  }
  return [
    compact
      ? "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-sm transition-colors duration-150 outline-none whitespace-nowrap"
      : "flex items-center px-4 py-2.5 rounded-lg font-medium transition-colors duration-150 outline-none",
    isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground"
      : "text-sidebar-foreground hover:bg-sidebar focus:bg-sidebar-accent active:bg-sidebar-accent",
  ].join(" ");
}

type NavItem = {
  to: string;
  label: string;
  icon: ReactNode;
  /** Only match the exact route (the "/cat" index). */
  end?: boolean;
  /** Requires a signed-in user; muted and non-navigating until then. */
  lockable?: boolean;
  lockIconClass?: string;
};

const catIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
    />
  </svg>
);

const discoverIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

const myCatsIcon = (
  <svg
    className="size-6"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 14.5c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4z" />
    <path d="M6 10.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    <path d="M9.5 6.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    <path d="M14.5 6.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    <path d="M18 10.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

const createCatIcon = (
  <svg
    className="size-6"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

const navItems: NavItem[] = [
  { to: "/cat", end: true, label: "Cat", icon: catIcon },
  { to: "/discover", label: "Discover", icon: discoverIcon },
  {
    to: "/mycats",
    label: "My cats",
    icon: myCatsIcon,
    lockable: true,
    lockIconClass: "ml-2",
  },
  {
    to: "/create-cat",
    label: "Create a Cat",
    icon: createCatIcon,
    lockable: true,
    lockIconClass: "ml-1",
  },
];

/** Shared nav links for the desktop sidebar and the mobile top bar. */
function renderNavLinks(
  { isAuthenticated, showAuth }: { isAuthenticated: boolean; showAuth: () => void },
  compact: boolean,
) {
  return navItems.map((item) => {
    const locked = item.lockable && !isAuthenticated;
    return (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end}
        aria-disabled={locked}
        className={({ isActive }: { isActive: boolean }) =>
          navLinkClass(isActive, { compact, locked })
        }
        onClick={(event) => {
          if (locked) {
            event.preventDefault();
            showAuth();
          }
        }}
      >
        {compact ? item.icon : <span className="mr-4">{item.icon}</span>}
        {item.label}
        {locked && (
          <LockIcon
            className={["size-4", compact ? undefined : item.lockIconClass]
              .filter(Boolean)
              .join(" ")}
            aria-hidden="true"
          />
        )}
      </NavLink>
    );
  });
}

/** Shared styling for the account button so the signed-in/out states match. */
const accountButtonClass =
  "mt-4 flex flex-row h-auto gap-0 border-0 rounded-md px-6 py-3 text-base font-normal whitespace-normal bg-sidebar-primary text-gray-200 shadow-md transition-colors duration-150 hover:bg-primary-strong-hover focus:outline-none focus:ring-2 focus:ring-sidebar-ring focus-visible:ring-2 focus-visible:ring-sidebar-ring active:bg-sidebar-primary active:not-aria-[haspopup]:translate-y-0";

/** Compact account button for the mobile top bar. */
const mobileAccountButtonClass =
  "shrink-0 flex-row h-8 gap-1.5 border-0 rounded-md px-3 text-sm font-normal whitespace-nowrap bg-sidebar-primary text-gray-200 shadow-sm transition-colors duration-150 hover:bg-primary-strong-hover focus:outline-none focus:ring-2 focus:ring-sidebar-ring active:bg-sidebar-primary active:not-aria-[haspopup]:translate-y-0";

const accountIcon = (
  <svg
    className="size-10"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      fillRule="evenodd"
      d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
      clipRule="evenodd"
    />
  </svg>
);

export function Sidebar() {
  const { user, isAuthenticated, showAuth, logout } = useUser();
  return (
    <>
      {/* On mobile the sidebar becomes a sticky top bar. */}
      <header className="md:hidden sticky top-0 z-40 flex flex-col bg-sidebar border-b border-border shadow-sm">
        <div className="flex min-w-0 items-center justify-between gap-3 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-3">
            <img src="/sidebar/cathat_logo.png" alt="Cat chat" className="h-9 w-auto shrink-0" />
            <span className="text-sidebar-foreground text-sm truncate">Real cats. Real chats.</span>
          </div>
          <Button
            className={mobileAccountButtonClass}
            onClick={isAuthenticated ? logout : showAuth}
          >
            {isAuthenticated ? "Sign out" : "Sign in"}
          </Button>
        </div>
        <nav className="flex w-full items-center gap-2 overflow-x-auto px-4 py-1.5">
          {renderNavLinks({ isAuthenticated, showAuth }, true)}
        </nav>
      </header>

      <aside className="hidden md:flex h-full min-h-dvh w-80 shrink-0 overflow-y-auto bg-sidebar flex-col p-8 sticky top-0">
        <img src="/sidebar/cathat_logo.png" alt="Cat chat" />
        <span className="text-sidebar-foreground">Real cats. Real chats.</span>

        <nav className="space-y-2 w-full mt-8 border-b-1 border-sidebar-border pb-4">
          {renderNavLinks({ isAuthenticated, showAuth }, false)}
        </nav>

        <img
          src="/sidebar/sleeping_cat.png"
          alt="Sleeping cat"
          className="h-30 w-auto mx-auto mt-16"
        />
        <img
          src="/sidebar/chat_with_your_favorite_cats.png"
          alt="Chat with cat"
          className="w-40 h-auto mx-auto"
        />

        <div className="flex flex-col items-center mt-6 mt-auto">
          <img src="/sidebar/shelf.png" alt="Shelf" className="w-56 h-auto -mb-8" />
          {isAuthenticated ? (
            <>
              <p className="mt-4 text-center text-foreground">
                Signed in as <span className="font-semibold">{user?.username}</span>
              </p>
              <Button className={accountButtonClass} onClick={logout}>
                {accountIcon}
                <span>Sign out</span>
              </Button>
            </>
          ) : (
            <Button className={accountButtonClass} onClick={showAuth}>
              {accountIcon}
              <span>Sign in to like, save or create cats!</span>
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}
