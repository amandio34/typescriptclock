// src/types/index.ts

// Byt ut enum mot union type
export type TimezoneId =
  | "Europe/Stockholm"
  | "America/New_York"
  | "Asia/Tokyo";
// ...lägg till fler vid behov

// src/types/index.ts
// ... behåll resten av dina typer ovanför

// API-response för timeapi.io
export interface TimezoneResponse {
  // fält som timeapi.io returnerar (minsta gemensamma nämnare)
  dateTime: string;    // ex. "2025-09-14T20:37:45.1234567"
  timeZone: string;    // ex. "Europe/Stockholm"

  // valfria extra fält som timeapi.io också kan returnera
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  seconds?: number;
}
