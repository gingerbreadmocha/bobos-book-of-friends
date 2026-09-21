import type { ChatMessage } from "@/components/chat/chat-messages";

export type GuestChatLog = ChatMessage & {
  createdAt?: string;
};

const GUEST_CHATS_KEY = "bobo-guestbook-guest-chats";
const GUEST_CAT_IDS_KEY = "bobo-guestbook-guest-cat-ids";

export function loadGuestChats(): Record<string, GuestChatLog[]> {
  try {
    const raw = localStorage.getItem(GUEST_CHATS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};

    const chats: Record<string, GuestChatLog[]> = {};
    for (const [name, logs] of Object.entries(parsed)) {
      if (Array.isArray(logs)) chats[name] = logs as GuestChatLog[];
    }
    return chats;
  } catch {
    return {};
  }
}

function loadGuestCatIds(): Record<string, string> {
  try {
    const raw = localStorage.getItem(GUEST_CAT_IDS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

/** Saves a guest conversation (history + id link) for the named cat. */
export function saveGuestChat(catName: string, catId: string, messages: GuestChatLog[]) {
  const chats = loadGuestChats();
  chats[catName] = messages;
  localStorage.setItem(GUEST_CHATS_KEY, JSON.stringify(chats));

  const ids = loadGuestCatIds();
  ids[catName] = catId;
  localStorage.setItem(GUEST_CAT_IDS_KEY, JSON.stringify(ids));
}

/** Returns each guest-chatted cat name paired with its real id, newest first. */
export function getGuestChattedCats(): { name: string; id: string; logs: GuestChatLog[] }[] {
  const chats = loadGuestChats();
  const ids = loadGuestCatIds();
  return Object.entries(chats)
    .filter(([, logs]) => logs.length > 0)
    .map(([name, logs]) => ({ name, id: ids[name] ?? "", logs }))
    .sort((a, b) => {
      const lastA = a.logs[a.logs.length - 1];
      const lastB = b.logs[b.logs.length - 1];
      return new Date(lastB.createdAt ?? 0).getTime() - new Date(lastA.createdAt ?? 0).getTime();
    });
}
