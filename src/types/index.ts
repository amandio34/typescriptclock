// src/types/index.ts

// Common timezones as a union type (easy to extend)
export type TimezoneId =
  | "Europe/Stockholm"
  | "America/New_York"
  | "Asia/Tokyo"
  | "Europe/London"
  | "America/Los_Angeles";

// Type for digital/analog clock mode
export type ClockMode = "digital" | "analog";

// City interface: describes a city object
export interface City {
  id: string;
  name: string;
  country?: string;
  timezone: TimezoneId | string;
  imageUrl?: string;
  coords?: {
    lat: number;
    lng: number;
  };
}

// Clock settings interface
export interface ClockSettings {
  mode: ClockMode;
  showSeconds: boolean;
  twelveHourFormat: boolean;
}

// State stored in localStorage
export interface StoredState {
  cities: City[];
  settings: ClockSettings;
}

/**
 * Response from timeapi.io (only the useful fields we care about)
 * Example: GET https://timeapi.io/api/Time/current/zone?timeZone=Europe/Stockholm
 */
export interface TimeApiResponse {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  seconds: number;
  milliSeconds?: number;
  dateTime: string; // ISO-like string, e.g. "2025-09-18T16:10:30"
  date?: string;
  time?: string;
  timeZone: string;
  dayOfWeek?: string;
  dstActive?: boolean;
}
