// src/hooks/useTimezones.ts
import { useEffect, useState } from "react";

/**
 * Local-first useTimezones
 * - First: try to read /timezones.json (public)
 * - Otherwise: try remote fetch once (non-blocking)
 * - Finally: use built-in DEFAULT_TIMEZONES
 * - Caches in localStorage (24h)
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

// Remote API for live data
const remoteUrl = "https://worldtimeapi.org/api/timezone";

const TIMEZONES_CACHE_KEY = "timezones_cache_v1";
const TIMEZONES_CACHE_TS_KEY = "timezones_cache_ts_v1";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function useTimezones() {
  const [timezones, setTimezones] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function tryLocalFirst() {
      // 1) Try cache first
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

      // 2) Try to read local public/timezones.json (fast and offline-friendly)
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
        // ignored - continue to remote/fallback
      }

      // 3) Try remote fetch ONCE. If fail -> use built-in fallback.
      try {
        const res = await fetch(remoteUrl, { cache: "no-store" });
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
        // remote failed; use fallback
        if (!mounted) return;
        if (cached) {
          try {
            const parsed = JSON.parse(cached) as string[];
            setTimezones(parsed);
            setError(`Could not fetch remote: ${(err && err.message) || "unknown"}. Using cache.`);
            setLoading(false);
            return;
          } catch {}
        }

        // Final built-in fallback
        setTimezones(DEFAULT_TIMEZONES);
        setError(`Could not fetch timezones: ${(err && err.message) || "unknown"}. Using built-in fallback.`);
        setLoading(false);
      }
    }

    tryLocalFirst();
    return () => {
      mounted = false;
    };
  }, []);

  return { timezones, loading, error };
}
