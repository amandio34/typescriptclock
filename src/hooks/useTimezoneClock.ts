// src/hooks/useTimezoneClock.ts
import { useEffect, useState } from "react";

/**
 * useTimezoneClock
 * - Returns a formatted time string for a given timezone and updates it regularly.
 * - showSeconds: true/false (default true)
 * - twelveHour: true/false (default false -> 24h)
 */
export function useTimezoneClock(
  timezone: string,
  { showSeconds = true, twelveHour = false } = {}
) {
  // State for the formatted time string
  const [timeString, setTimeString] = useState<string>("");

  useEffect(() => {
    if (!timezone) {
      setTimeString("");
      return;
    }

    // Formats the current time for the given timezone
    function formatNow() {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: twelveHour,
      };
      if (showSeconds) options.second = "2-digit";

      try {
        const fmt = new Intl.DateTimeFormat(undefined, {
          ...options,
          timeZone: timezone,
        });
        setTimeString(fmt.format(now));
      } catch {
        // If invalid timezone: show empty string
        setTimeString("");
      }
    }

    // Run immediately and then on interval
    formatNow();
    const interval = showSeconds ? 1000 : 60_000;
    const id = setInterval(formatNow, interval);
    return () => clearInterval(id);
  }, [timezone, showSeconds, twelveHour]);

  return timeString;
}
