// src/hooks/useTimezoneClock.ts
import { useEffect, useState } from "react";

/**
 * useTimezoneClock
 * - Ger en formaterad tidssträng för en given tidszon och uppdaterar regelbundet.
 * - showSeconds: true/false (default true)
 * - twelveHour: true/false (default false -> 24h)
 */
export function useTimezoneClock(
  timezone: string,
  { showSeconds = true, twelveHour = false } = {}
) {
  const [timeString, setTimeString] = useState<string>("");

  useEffect(() => {
    if (!timezone) {
      setTimeString("");
      return;
    }

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
        // Om ogiltig timezone: visa tom sträng
        setTimeString("");
      }
    }

    // kör direkt och sedan interval
    formatNow();
    const interval = showSeconds ? 1000 : 60_000;
    const id = setInterval(formatNow, interval);
    return () => clearInterval(id);
  }, [timezone, showSeconds, twelveHour]);

  return timeString;
}
