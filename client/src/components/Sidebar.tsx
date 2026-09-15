import { NavLink } from "react-router-dom";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "flex items-center px-4 py-2.5 rounded-lg font-medium transition-colors duration-150 outline-none",
    isActive
      ? "bg-violet-300 text-violet-950"
      : "text-violet-900 hover:bg-violet-100 focus:bg-violet-300 active:bg-violet-300",
  ].join(" ");

export function Sidebar() {
  return (
    <aside className="hidden md:flex h-full min-h-dvh w-80 shrink-0 overflow-y-auto bg-violet-100 flex-col p-8 sticky top-0">
      <img src="sidebar/cathat_logo.png" alt="Cat chat" />
      <span className="text-violet-900">Real cats. Real chats.</span>

      <nav className="space-y-2 w-full mt-8 border-b-1 border-violet-800 pb-4">
        <NavLink to="/cat" end className={navLinkClass}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6 mr-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
            />
          </svg>
          Cat
        </NavLink>

        <NavLink to="/discover" className={navLinkClass}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6 mr-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          Discover
        </NavLink>

        <NavLink to="/mycats" className={navLinkClass}>
          <svg
            className="size-6 mr-4"
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
          My cats
        </NavLink>

        <NavLink to="/create-cat" className={navLinkClass}>
          <svg
            className="size-6 mr-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          Create a Cat
        </NavLink>
      </nav>

      <img
        src="sidebar/sleeping_cat.png"
        alt="Sleeping cat"
        className="h-30 w-auto mx-auto mt-16"
      />
      <img
        src="sidebar/chat_with_your_favorite_cats.png"
        alt="Chat with cat"
        className="w-40 h-auto mx-auto"
      />

      <div className="flex flex-col items-center mt-6 mt-auto">
        <img
          src="sidebar/shelf.png"
          alt="Shelf"
          className="w-56 h-auto -mb-8"
        />
        <button className="mt-4 px-6 py-3 bg-violet-950 text-gray-200 rounded-md shadow-md hover:bg-violet-900 focus:outline-none focus:ring-2 focus:ring-violet-400 active:bg-violet-950 transition-colors duration-150 flex flex-row">
          <svg
            className="h-10"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Sign in to like, save or create cats!</span>
        </button>
      </div>
    </aside>
  );
}
