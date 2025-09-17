// src/types/index.ts

// No <div> or DOM elements are used in this file; only type definitions.

/** Import global styles if needed (unusual in a types file, but harmless) */
import './index.css';

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

// API response from worldtimeapi.org (fields are optional for flexibility)
export interface TimezoneResponse {
  abbreviation?: string;
  client_ip?: string;
  datetime?: string;      // ISO string
  utc_datetime?: string;  // sometimes named this
  day_of_week?: number;
  day_of_year?: number;
  dst?: boolean;
  dst_offset?: number;
  raw_offset?: number;
  timezone?: string;
  unixtime?: number;
  utc_offset?: string;
  week_number?: number;
}

