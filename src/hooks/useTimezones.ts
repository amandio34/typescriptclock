// src/hooks/useTimezones.ts
import { useEffect, useState } from "react";

/**
 * Robust useTimezones:
 * - använder cache i localStorage med timestamp
 * - om cache är färsk (default 24h) -> använd cache och hoppa över remote-fetch
 * - annars försök remote (timeout + retries) i bakgrunden, utan spam i konsolen
 * - fallback till public/timezones.json eller DEFAULT_TIMEZONES
 */

export const DEFAULT_TIMEZONES = [
  "Europe/Stockholm",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney"
];

const TIMEZONES_CACHE_KEY = "timezones_cache_v1";
const TIMEZONES_CACHE_TS_KEY = "timezones_cache_ts_v1";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 timmar

async function fetchWithTimeout(url: string, timeout = 5000, signal?: AbortSignal) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: signal ?? controller.signal });
    clearTimeout(timer);
    return res;
  } finally {
    clearTimeout(timer);
  }
}

export function useTimezones() {
  const [timezones, setTimezones] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Läs cache + timestamp
    const cached = localStorage.getItem(TIMEZONES_CACHE_KEY);
    const ts = localStorage.getItem(TIMEZONES_CACHE_TS_KEY);
    const cacheAge = ts ? Date.now() - Number(ts) : Infinity;
    const cacheIsFresh = cached && ts && cacheAge < CACHE_TTL_MS;

    if (cached) {
      try {
        const parsed = JSON.parse(cached) as string[];
        if (mounted) {
          setTimezones(parsed);
          setLoading(false);
        }
      } catch {
        // malformed cache -> ignore
      }
    }

    // Om cache är färsk: hoppa över remote-fetch helt (sparar nätverk + inga errors)
    if (cacheIsFresh) {
      return () => { mounted = false; };
    }

    // Annars: försök en bakgrundsrefresh (men tysta console.warn för nätverksfel)
    (async () => {
      const remoteUrl = "https://worldtimeapi.org/api/timezone";
      const localPublicUrl = "/timezones.json";
      const maxRetries = 2;
      let attempt = 0;
      let lastError: string | null = null;

      while (attempt <= maxRetries && mounted) {
        try {
          const res = await fetchWithTimeout(remoteUrl, 5000);
          if (!res.ok) {
            lastError = `HTTP ${res.status}`;
            throw new Error(lastError);
          }
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
        } catch (err: any) {
          lastError = err?.message ?? String(err);
          // ingen console.warn här — vi sparar fel i state istället
          const delay = Math.pow(2, attempt) * 400;
          await new Promise((r) => setTimeout(r, delay));
          attempt++;
        }
      }

      // remote misslyckades -> försök lokal public fallback
      try {
        const resLocal = await fetchWithTimeout(localPublicUrl, 3000);
        if (!resLocal.ok) throw new Error(`Local public HTTP ${resLocal.status}`);
        const jsonLocal = (await resLocal.json()) as string[];
        if (!mounted) return;
        try {
          localStorage.setItem(TIMEZONES_CACHE_KEY, JSON.stringify(jsonLocal));
          localStorage.setItem(TIMEZONES_CACHE_TS_KEY, String(Date.now()));
        } catch {}
        setTimezones(jsonLocal);
        setError(`Kunde inte hämta remote ( ${lastError ?? "okänt"} ). Använder lokal fallback.`);
        setLoading(false);
        return;
      } catch (err: any) {
        lastError = err?.message ?? String(err);
      }

      // slutgiltig inbyggd fallback
      if (!mounted) return;
      setTimezones(DEFAULT_TIMEZONES);
      setError(`Kunde inte hämta tidszoner: ${lastError ?? "okänt fel"}. Använder inbyggd fallback.`);
      setLoading(false);
    })();

    return () => { mounted = false; };
  }, []);

  return { timezones, loading, error };
}
