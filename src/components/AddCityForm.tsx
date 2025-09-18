// src/components/AddCityForm.tsx
import React, { useEffect, useRef, useState } from "react";
import type { City } from "../types";

interface Props {
  onAdd: (city: City) => void;
  /**
   * Optional list of timezones provided by parent.
   * If absent, the component will fetch available zones from timeapi.io.
   */
  timezones?: string[] | null;
  defaultTimezone?: string | null;
  existingCities?: City[];
}

export default function AddCityForm({
  onAdd,
  timezones: tzFromProps,
  defaultTimezone = null,
  existingCities = [],
}: Props) {
  // Form state
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [query, setQuery] = useState(defaultTimezone ?? "");
  const [timezone, setTimezone] = useState(defaultTimezone ?? "");
  const [timezones, setTimezones] = useState<string[]>(tzFromProps ?? []);
  const [filtered, setFiltered] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLUListElement | null>(null);

  // If parent provides timezones later, update local list
  useEffect(() => {
    if (Array.isArray(tzFromProps) && tzFromProps.length > 0) {
      setTimezones(tzFromProps);
    }
  }, [tzFromProps]);

  // If no timezone list from props, fetch available zones once
  useEffect(() => {
    if (tzFromProps && tzFromProps.length > 0) return; // parent provided list -> skip fetch

    let mounted = true;
    async function loadTimezones() {
      try {
        const res = await fetch("https://timeapi.io/api/TimeZone/AvailableTimeZones", { cache: "no-store" });
        if (!res.ok) throw new Error("Kunde inte hämta tidszoner");
        const data = (await res.json()) as string[];
        if (!mounted) return;
        setTimezones(data);
      } catch (err) {
        // silently fail — component still works with manual input and fallback
        console.error("Fel vid hämtning av tidszoner:", err);
      }
    }
    loadTimezones();
    return () => {
      mounted = false;
    };
  }, [tzFromProps]);

  // When defaultTimezone changes, set fields
  useEffect(() => {
    if (defaultTimezone) {
      setQuery(defaultTimezone);
      setTimezone(defaultTimezone);
    }
  }, [defaultTimezone]);

  // Filter timezone list based on query
  useEffect(() => {
    if (!timezones || query.trim() === "") {
      setFiltered([]);
      return;
    }
    const q = query.toLowerCase();
    setFiltered(timezones.filter((tz) => tz.toLowerCase().includes(q)).slice(0, 10));
  }, [query, timezones]);

  // Close dropdown if clicking outside
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!dropdownRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!dropdownRef.current.contains(e.target)) {
        setFiltered([]);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Generate unique ID for new city
  function makeId() {
    if (typeof crypto !== "undefined" && (crypto as any).randomUUID) return (crypto as any).randomUUID();
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !timezone.trim()) return alert("Ange både stadens namn och tidszon.");
    const city: City = {
      id: makeId(),
      name: name.trim(),
      country: country.trim() || undefined,
      timezone,
    };

    // Optional: check for duplicates
    const exists = existingCities.some(
      (c) => c.name.toLowerCase() === city.name.toLowerCase() || c.timezone === city.timezone
    );
    if (exists && !confirm("Liknande stad/tidszon finns redan. Vill du lägga till ändå?")) return;

    onAdd(city);
    setName("");
    setCountry("");
    setQuery("");
    setTimezone("");
    setFiltered([]);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">
      {/* City name input */}
      <fieldset className="w-full border-0 p-0 m-0">
        <legend className="block text-sm text-slate-600 mb-1">Stadsnamn</legend>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="t.ex. Stockholm"
          required
        />
      </fieldset>

      {/* Country input (optional) */}
      <fieldset className="w-full border-0 p-0 m-0">
        <legend className="block text-sm text-slate-600 mb-1">Land (valfritt)</legend>
        <input
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="t.ex. Sverige"
        />
      </fieldset>

      {/* Timezone search and dropdown */}
      <section className="w-full relative">
        <label className="block text-sm text-slate-600 mb-1">Tidszon (sök)</label>
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setTimezone(e.target.value);
            }}
            className="flex-1 p-2 border rounded"
            placeholder="Börja skriva..."
            aria-label="Sök tidszon"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setTimezone("");
              setFiltered([]);
            }}
            className="px-3 py-2 border rounded text-sm"
          >
            Rensa
          </button>
        </div>

        {/* Dropdown with filtered timezones */}
        {filtered.length > 0 && (
          <ul
            ref={dropdownRef}
            className="absolute z-10 bg-white border rounded mt-1 w-full max-h-48 overflow-y-auto shadow-lg text-left"
          >
            {filtered.map((tz) => (
              <li
                key={tz}
                onClick={() => {
                  setTimezone(tz);
                  setQuery(tz);
                  setFiltered([]);
                }}
                className="px-3 py-2 cursor-pointer hover:bg-sky-100"
              >
                {tz}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Submit button */}
      <section>
        <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700">
          Lägg till stad
        </button>
      </section>
    </form>
  );
}
