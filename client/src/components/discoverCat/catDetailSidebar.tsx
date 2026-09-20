import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { useNavigate } from "react-router-dom";
import type { Cat } from "@/hooks/useGetCats";
import { Button } from "@/components/ui/button";
import { getRandomAvatar } from "@/utils/getRandomAvatar";
import { cn } from "cn";
import { XIcon } from "lucide-react";
import { getAllPersonalityTags } from "./personalityTags";

type CatDetailSidebarProps = {
  cat: Cat | null;
  open: boolean;
  onClose: () => void;
};

export function CatDetailSidebar({
  cat,
  open,
  onClose,
}: CatDetailSidebarProps) {
  const navigate = useNavigate();

  const pictureSrc = cat?.avatarUrl ? cat.avatarUrl : getRandomAvatar();
  const personalityTags = cat ? getAllPersonalityTags(cat.personality) : [];

  const handleChat = () => {
    if (cat) {
      navigate(`/cat/${cat.id}`);
    }
  };

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 isolate z-50 bg-overlay/30 duration-100 backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out" />

        <DialogPrimitive.Popup className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-accent-strong text-foreground p-6 sm:p-8 duration-150 overflow-y-auto shadow-2xl outline-none data-open:animate-in data-open:slide-in-from-right-full data-closed:animate-out data-closed:slide-out-to-right-full">
          {cat && (
            <>
              <DialogPrimitive.Close
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="absolute top-3 right-3"
                  />
                }
              >
                <XIcon />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>

              <div className="flex flex-col items-center pt-10">
                <img
                  src={pictureSrc}
                  alt={
                    cat.avatarUrl ? `${cat.name}'s photo` : `${cat.name} avatar`
                  }
                  className="h-44 w-44 rounded-full shrink-0 object-cover"
                />
                <DialogPrimitive.Title className="mt-4 text-2xl font-semibold text-foreground">
                  {cat.name}
                </DialogPrimitive.Title>
                {cat.owner && (
                  <p className="mt-1 text-sm text-foreground-subtle">
                    by {cat.owner.username}
                  </p>
                )}
              </div>

              {personalityTags.length > 0 && (
                <section
                  className="mt-6"
                  aria-labelledby="cat-sidebar-tags-heading"
                >
                  <h3
                    id="cat-sidebar-tags-heading"
                    className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle"
                  >
                    Personality
                  </h3>
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
                </section>
              )}

              <section
                className="mt-6"
                aria-labelledby="cat-sidebar-about-heading"
              >
                <h3
                  id="cat-sidebar-about-heading"
                  className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle"
                >
                  About {cat.name}
                </h3>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-foreground-soft">
                  {cat.description}
                </p>
              </section>

              <section
                className="mt-6"
                aria-labelledby="cat-sidebar-about-heading"
              >
                <h3
                  id="cat-sidebar-about-heading"
                  className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle"
                >
                  Popularity
                </h3>
                <span className="mt-3 whitespace-pre-line leading-relaxed text-foreground-soft flex flex-row">
                  {cat.popularity}

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6 text-pink-500 ml-1"
                  >
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                  </svg>
                </span>
              </section>

              <Button
                onClick={handleChat}
                className="mt-8 w-full justify-center bg-primary text-primary-foreground hover:bg-primary/80"
              >
                Chat with {cat.name}
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
                    d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                  />
                </svg>
              </Button>
            </>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
