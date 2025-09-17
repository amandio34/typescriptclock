// src/hooks/useWorldTimeApi.ts
import { useEffect, useState } from "react";
import type { TimezoneResponse } from "../types";

interface UseWorldTimeResult {
  time: Date | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom React hook to fetch and keep current time for a given timezone.
 * - Fetches from worldtimeapi.org.
 * - Updates every 60 seconds.
 * - Handles loading and error state.
 */
export function useWorldTimeApi(timezone: string): UseWorldTimeResult {
  const [time, setTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Fetches the current time from the API and updates state
    async function fetchTime() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://worldtimeapi.org/api/timezone/${timezone}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as TimezoneResponse;
        // Try to get ISO string from different possible fields
        const iso =
          json.datetime ??
          json.utc_datetime ??
          (json.unixtime ? new Date(json.unixtime * 1000).toISOString() : undefined);
        if (!mounted) return;
        setTime(iso ? new Date(iso) : null);
        setLoading(false);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message ?? "Okänt fel");
        setLoading(false);
      }
    }

    fetchTime();
    // Set up interval to refetch every 60 seconds
    const id = setInterval(fetchTime, 60_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [timezone]);

  return { time, loading, error };
}
