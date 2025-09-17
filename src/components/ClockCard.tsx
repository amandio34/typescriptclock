// src/components/ClockCard.tsx
import React, { useEffect, useRef, useState } from "react";
import type { City, ClockMode } from "../types";
import { useWorldTimeApi } from "../hooks/useWorldTimeApi";

interface Props {
  city: City;
  onDelete?: (id: string) => void;
}

// Helper to extract hour, minute, second from a Date in a specific timezone
function getTimeParts(date: Date, timezone: string) {
  try {
    const parts = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: timezone,
    }).formatToParts(date);

    const map = parts.reduce<Record<string, string>>((acc, p) => {
      if (p.type !== "literal") acc[p.type] = p.value;
      return acc;
    }, {});

    return {
      h: Number(map.hour ?? 0),
      m: Number(map.minute ?? 0),
      s: Number(map.second ?? 0),
    };
  } catch {
    // Fallback to local values if Intl fails
    return { h: date.getHours(), m: date.getMinutes(), s: date.getSeconds() };
  }
}

export default function ClockCard({ city, onDelete }: Props) {
  const [mode, setMode] = useState<ClockMode>("digital");

  // Fetches and resyncs time from API every 60s
  const { time: apiTime, loading: apiLoading, error: apiError } = useWorldTimeApi(String(city.timezone));

  // Local "current" Date, updated every second, synced from apiTime
  const [current, setCurrent] = useState<Date>(() => (apiTime ? new Date(apiTime) : new Date()));
  const prevPartsRef = useRef<{ h: number; m: number; s: number } | null>(null);
  const secTransitionRef = useRef(true);

  // When apiTime changes, resync local clock
  useEffect(() => {
    if (apiTime) {
      setCurrent(new Date(apiTime));
      prevPartsRef.current = getTimeParts(new Date(apiTime), String(city.timezone));
    }
  }, [apiTime, city.timezone]);

  // Local tick: increments current by 1000ms every second
  useEffect(() => {
    if (!current) setCurrent(new Date());

    const id = setInterval(() => {
      setCurrent((prev) => {
        const now = prev ? new Date(prev.getTime() + 1000) : new Date();

        // Detect if second hand wraps from 59 to 0 in target timezone
        const prevParts = prev ? getTimeParts(prev, String(city.timezone)) : null;
        const nowParts = getTimeParts(now, String(city.timezone));

        if (prevParts && prevParts.s === 59 && nowParts.s === 0) {
          // Briefly disable transition for smooth second hand jump
          secTransitionRef.current = false;
          setTimeout(() => {
            secTransitionRef.current = true;
          }, 80);
        }

        prevPartsRef.current = nowParts;
        return now;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [city.timezone]);

  // Get hour, minute, second for the clock hands
  const parts = current ? getTimeParts(current, String(city.timezone)) : null;
  const hours = parts ? parts.h : 0;
  const minutes = parts ? parts.m : 0;
  const seconds = parts ? parts.s : 0;

  // Calculate degrees for each hand
  const secDeg = seconds * 6; // 360/60
  const minDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = ((hours % 12) * 30) + (minutes * 0.5);

  // Digital display string, formatted for correct timezone
  const digitalString = current
    ? new Intl.DateTimeFormat("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: String(city.timezone),
      }).format(current)
    : apiError
    ? "–"
    : "";

  return (
    <article className="clock-card bg-white rounded-lg p-4 shadow-sm flex flex-col items-center gap-4">
      {/* City name and timezone */}
      <header className="w-full flex items-start justify-between">
        <section>
          <h3 className="text-lg font-medium">{city.name}</h3>
          {city.country && <p className="text-xs text-slate-500">{city.country}</p>}
        </section>
        <aside className="text-xs text-slate-400">{String(city.timezone)}</aside>
      </header>

      {/* Digital or analog clock display */}
      {mode === "digital" ? (
        <section className="flex flex-col items-center gap-2">
          {apiLoading && <span className="text-sm text-slate-400">Laddar tid…</span>}
          {apiError && <span className="text-sm text-rose-600">{apiError}</span>}
          <output className="text-2xl font-mono">{digitalString || "–"}</output>
        </section>
      ) : (
        <section className="flex flex-col items-center">
          {/* Analog clock face */}
          <figure className="relative w-40 h-40 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center">
            {/* Tick marks */}
            <section className="absolute inset-0">
              {[...Array(12)].map((_, i) => {
                const angle = i * 30;
                const long = i % 3 === 0;
                return (
                  <span
                    key={i}
                    style={{ transform: `rotate(${angle}deg) translateY(-96px)` }}
                    className={`absolute left-1/2 top-1/2 ${long ? "w-0.5 h-3" : "w-0.5 h-2"} bg-slate-400 origin-center`}
                  />
                );
              })}
            </section>

            {/* Hour hand */}
            <span
              aria-hidden
              style={{
                transform: `translateX(-50%) translateY(-100%) rotate(${hourDeg}deg)`,
                transition: "transform 0.3s ease-in-out",
                width: "4px",
                height: "9rem",
              }}
              className="absolute left-1/2 top-1/2 origin-bottom bg-slate-800 rounded-sm z-10"
            />

            {/* Minute hand */}
            <span
              aria-hidden
              style={{
                transform: `translateX(-50%) translateY(-100%) rotate(${minDeg}deg)`,
                transition: "transform 0.18s linear",
                width: "3px",
                height: "12rem",
              }}
              className="absolute left-1/2 top-1/2 origin-bottom bg-slate-700 rounded-sm z-20"
            />

            {/* Second hand */}
            <span
              aria-hidden
              style={{
                transform: `translateX(-50%) translateY(-100%) rotate(${secDeg}deg)`,
                transition: secTransitionRef.current ? "transform 0.05s linear" : "none",
                width: "2px",
                height: "14rem",
              }}
              className="absolute left-1/2 top-1/2 origin-bottom bg-red-500 rounded-sm z-30"
            />

            {/* Center dot */}
            <span className="absolute left-1/2 top-1/2 w-3 h-3 bg-slate-900 rounded-full -translate-x-1/2 -translate-y-1/2 z-40" />
          </figure>
        </section>
      )}

      {/* Action buttons */}
      <footer className="w-full flex items-center justify-between">
        <nav className="flex gap-2">
          <button
            onClick={() => setMode(mode === "digital" ? "analog" : "digital")}
            className="px-3 py-1 bg-sky-600 text-white rounded hover:bg-sky-700 text-sm"
          >
            Växla vy
          </button>
        </nav>

        <nav className="flex gap-2">
          {onDelete && (
            <button
              onClick={() => {
                if (confirm(`Ta bort ${city.name}?`)) onDelete(city.id);
              }}
              className="px-3 py-1 bg-rose-500 text-white rounded hover:bg-rose-600 text-sm"
            >
              Ta bort
            </button>
          )}
        </nav>
      </footer>
    </article>
  );
}
