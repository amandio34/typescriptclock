// src/hooks/useWorldTimeApi.ts
import { useEffect, useState } from "react";
import type { TimezoneResponse } from "../types";

export function useWorldTimeApi(timezone: string) {
  const [data, setData] = useState<TimezoneResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchTime() {
      try {
        setLoading(true);
        setError(null);
        const url = `https://timeapi.io/api/Time/current/zone?timeZone=${encodeURIComponent(timezone)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API-fel ${res.status}`);
        const json = (await res.json()) as TimezoneResponse;
        if (!mounted) return;
        setData(json);
      } catch (err: any) {
        if (!mounted) return;
        setError((err && err.message) || "Okänt fel");
        setData(null);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }
    fetchTime();
    return () => { mounted = false; };
  }, [timezone]);

  return { data, loading, error };
}
