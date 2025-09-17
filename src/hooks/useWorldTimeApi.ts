// src/hooks/useWorldTimeApi.ts
// Quick stub: returnerar direkt ett "ingen nätverks-handle" resultat.
// Använd detta om du vill slippa external API-anrop medan du jobbar offline.

import type { TimezoneResponse } from "../types";

export function useWorldTimeApi(_timezone: string) {
  // ingen fetch — vi kör offline / klienttid någon annanstans
  return {
    data: null as TimezoneResponse | null,
    loading: false,
    error: "Network disabled - using client-side time"
  };
}
