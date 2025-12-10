/**
 * localStorage service for managing anonymous swipe data.
 * Stores swipes locally until user logs in, then merges to database.
 */

export interface AnonymousSwipe {
  dogId: string;
  liked: boolean;
  timestamp: number;
}

interface AnonymousSwipesData {
  swipes: AnonymousSwipe[];
  version: number;
}

const STORAGE_KEY = "dog_tinder_anonymous_swipes";
const CURRENT_VERSION = 1;
const MAX_SWIPES = 500;

/**
 * Get all anonymous swipes from localStorage
 */
export function getAnonymousSwipes(): AnonymousSwipe[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const data: AnonymousSwipesData = JSON.parse(raw);
    if (data.version !== CURRENT_VERSION) {
      // Handle migration if needed, for now just clear
      clearAnonymousSwipes();
      return [];
    }
    return data.swipes;
  } catch (error) {
    console.error("Failed to read anonymous swipes:", error);
    return [];
  }
}

/**
 * Save a swipe to localStorage
 * @returns true if saved, false if already swiped or error
 */
export function saveAnonymousSwipe(dogId: string, liked: boolean): boolean {
  if (typeof window === "undefined") return false;

  try {
    const swipes = getAnonymousSwipes();

    // Check if already swiped
    if (swipes.some((s) => s.dogId === dogId)) {
      return false;
    }

    // Enforce max limit (remove oldest if at capacity)
    if (swipes.length >= MAX_SWIPES) {
      swipes.shift();
    }

    swipes.push({
      dogId,
      liked,
      timestamp: Date.now(),
    });

    const data: AnonymousSwipesData = {
      swipes,
      version: CURRENT_VERSION,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    // Handle QuotaExceededError
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      console.warn("localStorage quota exceeded, clearing old data");
      clearAnonymousSwipes();
    }
    console.error("Failed to save anonymous swipe:", error);
    return false;
  }
}

/**
 * Get all swiped dog IDs (both likes and passes)
 */
export function getAnonymousSwipedDogIds(): string[] {
  return getAnonymousSwipes().map((s) => s.dogId);
}

/**
 * Get only liked dogs
 */
export function getAnonymousLikedDogs(): AnonymousSwipe[] {
  return getAnonymousSwipes().filter((s) => s.liked);
}

/**
 * Clear all anonymous swipes (call after merge)
 */
export function clearAnonymousSwipes(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Check if there are any anonymous swipes
 */
export function hasAnonymousSwipes(): boolean {
  return getAnonymousSwipes().length > 0;
}
