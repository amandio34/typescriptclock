import { useState, useEffect } from "react";

/**
 * Custom React hook for syncing state with localStorage.
 * - Reads from localStorage on mount (or uses initialValue if not found).
 * - Writes to localStorage whenever the state changes.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Initialize state from localStorage or use initialValue
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Update localStorage whenever key or state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore write errors (e.g., storage full)
    }
  }, [key, state]);

  // Return state and setter as a tuple
  return [state, setState] as const;
}
