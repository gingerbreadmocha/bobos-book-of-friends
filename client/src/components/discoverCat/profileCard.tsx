import { useMemo, type KeyboardEvent, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { Cat } from "@/hooks/useGetCats";
import { useCat } from "@/context/cat-context";
import { Button } from "@/components/ui/button";
import { getRandomAvatar } from "@/utils/getRandomAvatar";
import { cn } from "cn";
import { getAllPersonalityTags } from "./personalityTags";

function pickRandomTags(personality: Record<string, unknown>) {
  const availableTags = getAllPersonalityTags(personality);

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
  /** Called when the card is clicked to open the cat's detail sidebar. */
  onSelect?: (cat: Cat) => void;
};

export function ProfileCard({ cat, onChat, onSelect }: ProfileCardProps) {
  const navigate = useNavigate();
  const { selectCat } = useCat();

  const pictureSrc = cat.avatarUrl ? cat.avatarUrl : getRandomAvatar();
  const personalityTags = useMemo(
    () => pickRandomTags(cat.personality),
    [cat.personality],
  );

  const handleChat = (event: MouseEvent<HTMLButtonElement>) => {
    // Clicking "Chat" is an action inside the card, so don't also open the
    // detail sidebar.
    event.stopPropagation();
    // Save the cat we're chatting with so the chat page knows who it's for.
    selectCat(cat);
    if (onChat) {
      onChat(cat);
    } else {
      navigate("/cat");
    }
  };

  const handleSelect = () => {
    onSelect?.(cat);
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelect();
    }
  };

  const truncatedDescription = cat?.description.slice(0, 100) + "...";

  return (
    <article
      aria-label={`View ${cat.name}'s full profile`}
      role="button"
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={handleCardKeyDown}
      className="flex flex-col overflow-hidden rounded-2xl border-2 border-border bg-white/70 shadow-sm transition-shadow duration-150 hover:shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring max-w-[300px] min-h-[500px] justify-center items-center pt-4"
    >
      <img
        src={pictureSrc}
        alt={cat.avatarUrl ? `${cat.name}'s photo` : `${cat.name} avatar`}
        className="h-48 w-48 rounded-full shrink-0 object-cover"
      />
      <div className="flex flex-1 flex-col p-4">
        <h2 className="text-xl font-semibold text-foreground">{cat.name}</h2>
        {cat.owner && (
          <p className="mt-1 text-sm text-foreground-subtle">
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
                key={tag.id}
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
          className="mt-auto w-full justify-center bg-primary text-primary-foreground hover:bg-primary/80"
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
