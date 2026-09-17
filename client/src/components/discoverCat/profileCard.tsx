import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Cat } from "@/hooks/useGetCats";
import { Button } from "@/components/ui/button";
import { getRandomAvatar } from "@/utils/getRandomAvatar";
import { cn } from "cn";

const PERSONALITY_TAG_COLORS = {
  energy: "bg-yellow-200 text-yellow-800",
  affection: "bg-red-200 text-red-800",
  vocal: "bg-cyan-200 text-cyan-800",
  strangers: "bg-purple-200 text-purple-800",
  cats: "bg-lime-200 text-lime-800",
  favoriteActivity: "bg-orange-200 text-orange-800",
  whenWantingSomething: "bg-pink-200 text-pink-800",
};

function pickRandomTags(personality: Record<string, unknown>) {
  const availableTags = Object.entries(PERSONALITY_TAG_COLORS).flatMap(
    ([key, className]) => {
      const value = personality[key];
      if (typeof value !== "string" || value.trim() === "") return [];
      return [{ label: value, className }];
    },
  );

  for (let i = availableTags.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableTags[i], availableTags[j]] = [availableTags[j], availableTags[i]];
  }
  return availableTags.slice(0, 2);
}

type ProfileCardProps = {
  cat: Cat;
  /** Override the default "chat" behavior (which opens the /cat page). */
  onChat?: (cat: Cat) => void;
};

export function ProfileCard({ cat, onChat }: ProfileCardProps) {
  const navigate = useNavigate();

  const pictureSrc = cat.avatarUrl ? cat.avatarUrl : getRandomAvatar();
  const personalityTags = useMemo(
    () => pickRandomTags(cat.personality),
    [cat.personality],
  );

  const handleChat = () => {
    if (onChat) {
      onChat(cat);
    } else {
      navigate("/cat");
    }
  };

  const truncatedDescription = cat?.description.slice(0, 100) + "...";

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border-2 border-violet-200 bg-white/70 shadow-sm transition-shadow duration-150 hover:shadow-md max-w-[300px] min-h-[500px] justify-center items-center pt-4">
      <img
        src={pictureSrc}
        alt={cat.avatarUrl ? `${cat.name}'s photo` : `${cat.name} avatar`}
        className="h-48 w-48 rounded-full shrink-0 object-cover"
      />
      <div className="flex flex-1 flex-col p-4">
        <h2 className="text-xl font-semibold text-violet-950">{cat.name}</h2>
        {cat.owner && (
          <p className="mt-1 text-sm text-violet-700">
            by {cat.owner.username}
          </p>
        )}
        {personalityTags.length > 0 && (
          <ul
            aria-label={`${cat.name}'s personality`}
            className="mt-3 flex flex-wrap gap-2"
          >
            {personalityTags.map((tag) => (
              <li
                key={tag.label}
                className={cn(
                  "rounded-full px-3 py-1 text-sm font-medium",
                  tag.className,
                )}
              >
                {tag.label}
              </li>
            ))}
          </ul>
        )}
        <div className="justify-start">{truncatedDescription}</div>
        <Button
          onClick={handleChat}
          className="mt-auto w-full justify-center bg-violet-400 text-white hover:bg-violet-500"
        >
          Chat with {cat.name}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
            />
          </svg>
        </Button>
      </div>
    </article>
  );
}
