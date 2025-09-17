import { useEffect, useRef } from "react";

/**
 * Custom React hook for running a callback on a set interval.
 * - The callback is always up-to-date (no stale closure).
 * - If delay is null, the interval is not set.
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // Update the ref if the callback changes
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval and clear it on cleanup or delay change
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
