// src/hooks/useTimezones.ts
import { useEffect, useState } from "react";

/**
 * Local-first useTimezones
 * - Först: försök läsa /timezones.json (public)
 * - Annars: försök remote en gång (icke-blockerande)
 * - Slutligen: inbyggd DEFAULT_TIMEZONES
 * - Sparar cache i localStorage (24h)
 */

export const DEFAULT_TIMEZONES = [
  "Europe/Stockholm",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "America/Toronto",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Singapore",
  "Australia/Sydney",
];

const TIMEZONES_CACHE_KEY = "timezones_cache_v1";
const TIMEZONES_CACHE_TS_KEY = "timezones_cache_ts_v1";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 timmar

export function useTimezones() {
  const [timezones, setTimezones] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function tryLocalFirst() {
      // 1) Läs cache först
      const cached = localStorage.getItem(TIMEZONES_CACHE_KEY);
      const ts = localStorage.getItem(TIMEZONES_CACHE_TS_KEY);
      const cacheAge = ts ? Date.now() - Number(ts) : Infinity;
      const cacheIsFresh = cached && ts && cacheAge < CACHE_TTL_MS;

      if (cached && cacheIsFresh) {
        try {
          const parsed = JSON.parse(cached) as string[];
          if (mounted) {
            setTimezones(parsed);
            setLoading(false);
            setError(null);
            return;
          }
        } catch {
          // ignore malformed cache
        }
      }

      // 2) Försök läs lokal public/timezones.json (snabb och offline-friendly)
      try {
        const resLocal = await fetch("/timezones.json");
        if (resLocal.ok) {
          const jsonLocal = (await resLocal.json()) as string[];
          if (!mounted) return;
          try {
            localStorage.setItem(TIMEZONES_CACHE_KEY, JSON.stringify(jsonLocal));
            localStorage.setItem(TIMEZONES_CACHE_TS_KEY, String(Date.now()));
          } catch {}
          setTimezones(jsonLocal);
          setLoading(false);
          setError(null);
          return;
        }
      } catch {
        // ignored - fortsätt till remote/fallback
      }

      // 3) Försök remote EN gång (icke-spammigt). Om fail -> inbyggd fallback.
      try {
        const res = await fetch("/timezones.json", { cache: "no-store" });
        if (res.ok) {
          const json = (await res.json()) as string[];
          if (!mounted) return;
          try {
            localStorage.setItem(TIMEZONES_CACHE_KEY, JSON.stringify(json));
            localStorage.setItem(TIMEZONES_CACHE_TS_KEY, String(Date.now()));
          } catch {}
          setTimezones(json);
          setError(null);
          setLoading(false);
          return;
        } else {
          throw new Error(`HTTP ${res.status}`);
        }
      } catch (err: any) {
        // remote misslyckades; använd fallback
        if (!mounted) return;
        // försök igen att använda cache-fast eller default
        if (cached) {
          try {
            const parsed = JSON.parse(cached) as string[];
            setTimezones(parsed);
            setError(`Kunde inte hämta remote: ${(err && err.message) || "okänt"}. Använder cache.`);
            setLoading(false);
            return;
          } catch {}
        }

        // slutgiltig inbyggd fallback
        setTimezones(DEFAULT_TIMEZONES);
        setError(`Kunde inte hämta tidszoner: ${(err && err.message) || "okänt"}. Använder inbyggd fallback.`);
        setLoading(false);
      }
    }

    tryLocalFirst();
    return () => { mounted = false; };
  }, []);

  return { timezones, loading, error };
}
