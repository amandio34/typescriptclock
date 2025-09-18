// src/hooks/useWorldTimeApi.ts
import { useEffect, useState } from "react";
import type { TimeApiResponse } from "../types";

interface UseWorldTimeResult {
  time: Date | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom React hook to fetch and keep current time for a given timezone.
 * - Fetches from timeapi.io.
 * - Updates every 60 seconds.
 * - Handles loading and error state.
 */
export function useWorldTimeApi(timezone: string): UseWorldTimeResult {
  const [time, setTime] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    /** Fetch current time from timeapi.io */
    async function fetchTime() {
      setLoading(true);
      setError(null);
      try {
        // Example: https://timeapi.io/api/Time/current/zone?timeZone=Europe/Stockholm
        const res = await fetch(
          `https://timeapi.io/api/Time/current/zone?timeZone=${encodeURIComponent(timezone)}`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = (await res.json()) as TimeApiResponse;
        if (!mounted) return;

        // Convert ISO string to Date
        setTime(new Date(json.dateTime));
        setLoading(false);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message ?? "Unknown error");
        setLoading(false);
      }
    }

    fetchTime();
    // Refresh every 60s
    const id = setInterval(fetchTime, 60_000);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [timezone]);

  return { time, loading, error };
}
