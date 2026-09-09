const STORAGE_KEY = "fifelite_wallet_seen_events";
const LAST_EVENT_KEY = "fifelite_wallet_last_event_id";
const ANIMATED_CARDS_KEY = "fifelite_wallet_animated_cards";

const memoryLastEventId: { value?: string } = {};
const memorySeenEvents = new Set<string>();
const memoryAnimatedCards = new Set<string>();

function canUseSessionStorage() {
  try {
    return typeof window !== "undefined" && typeof sessionStorage !== "undefined";
  } catch {
    return false;
  }
}

function readSet(key: string): Set<string> {
  if (!canUseSessionStorage()) {
    return key === ANIMATED_CARDS_KEY ? new Set(memoryAnimatedCards) : new Set(memorySeenEvents);
  }
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(parsed);
  } catch {
    return new Set();
  }
}

function writeSet(key: string, set: Set<string>) {
  if (!canUseSessionStorage()) {
    const target = key === ANIMATED_CARDS_KEY ? memoryAnimatedCards : memorySeenEvents;
    target.clear();
    for (const item of set) target.add(item);
    return;
  }
  sessionStorage.setItem(key, JSON.stringify([...set].slice(-200)));
}

export function getStoredLastEventId(): string | undefined {
  if (!canUseSessionStorage()) return memoryLastEventId.value;
  return sessionStorage.getItem(LAST_EVENT_KEY) ?? undefined;
}

export function storeLastEventId(id: string) {
  memoryLastEventId.value = id;
  if (!canUseSessionStorage()) return;
  sessionStorage.setItem(LAST_EVENT_KEY, id);
}

export function hasSeenWalletEvent(eventId: string) {
  return readSet(STORAGE_KEY).has(eventId);
}

export function markWalletEventSeen(eventId: string) {
  const set = readSet(STORAGE_KEY);
  set.add(eventId);
  writeSet(STORAGE_KEY, set);
  storeLastEventId(eventId);
}

export function hasAnimatedCard(membershipId: string) {
  return readSet(ANIMATED_CARDS_KEY).has(membershipId);
}

export function markCardAnimated(membershipId: string) {
  const set = readSet(ANIMATED_CARDS_KEY);
  set.add(membershipId);
  writeSet(ANIMATED_CARDS_KEY, set);
}

/** True si l’animation « nouvelle carte » doit être jouée pour cet événement. */
export function shouldPlayNewCardAnimation(
  eventId: string,
  membershipId: string | null | undefined,
  cardAlreadyInWallet: boolean,
) {
  if (cardAlreadyInWallet) return false;
  if (hasSeenWalletEvent(eventId)) return false;
  if (membershipId && hasAnimatedCard(membershipId)) return false;
  return true;
}

/** Utilisé par les tests pour réinitialiser l’état en mémoire. */
export function resetWalletEventDedupForTests() {
  memorySeenEvents.clear();
  memoryAnimatedCards.clear();
  memoryLastEventId.value = undefined;
}
