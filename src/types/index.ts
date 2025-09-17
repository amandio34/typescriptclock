// src/types/index.ts
import './index.css';

// Vanliga tidszoner (union type, utökningsbar)
export type TimezoneId =
  | "Europe/Stockholm"
  | "America/New_York"
  | "Asia/Tokyo"
  | "Europe/London"
  | "America/Los_Angeles";

// Typ för digital/analog vy
export type ClockMode = "digital" | "analog";

// Interface för en stad
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

// Interface för klockinställningar
export interface ClockSettings {
  mode: ClockMode;
  showSeconds: boolean;
  twelveHourFormat: boolean;
}

// Sparad state
export interface StoredState {
  cities: City[];
  settings: ClockSettings;
}

// API-response för timeapi.io
export interface TimezoneResponse {
  dateTime: string;
  timeZone: string;
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  seconds?: number;
}
