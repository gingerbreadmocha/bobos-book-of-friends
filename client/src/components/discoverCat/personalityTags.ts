export const PERSONALITY_TAG_COLORS: Record<string, string> = {
  energy: "bg-yellow-200 text-yellow-800",
  affection: "bg-red-200 text-red-800",
  vocal: "bg-cyan-200 text-cyan-800",
  strangers: "bg-purple-200 text-purple-800",
  cats: "bg-lime-200 text-lime-800",
  favoriteActivity: "bg-orange-200 text-orange-800",
  whenWantingSomething: "bg-pink-200 text-pink-800",
  vibe: "bg-indigo-200 text-indigo-800",
};

export type PersonalityTag = {
  id: string;
  label: string;
  className: string;
};

/** Returns every answered personality question as a pill tag. */
export function getAllPersonalityTags(personality: Record<string, unknown>): PersonalityTag[] {
  return Object.entries(PERSONALITY_TAG_COLORS).flatMap(([id, className]) => {
    const value = personality[id];
    if (typeof value !== "string" || value.trim() === "") return [];
    return [{ id, label: value, className }];
  });
}
