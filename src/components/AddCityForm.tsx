import React, { useState, useEffect } from "react";
import type { City } from "../types";
import SearchableTimezoneInput from "./SearchableTimezoneInput";

interface Props {
  onAdd: (city: City) => void;
  timezones?: string[] | null;
  initialTimezone?: string; // ny prop: förifyll från sidopanelen
}

export default function AddCityForm({ onAdd, timezones, initialTimezone }: Props) {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [timezone, setTimezone] = useState<string>("");

  // Set default timezone när timezones laddas eller initialTimezone ändras
  useEffect(() => {
    if (initialTimezone && initialTimezone.trim()) {
      setTimezone(initialTimezone);
      return;
    }
    if (timezones && timezones.length > 0 && !timezone) {
      setTimezone(timezones[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timezones, initialTimezone]);

  function makeId() {
    if (typeof crypto !== "undefined" && (crypto as any).randomUUID) return (crypto as any).randomUUID();
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Ange ett namn för staden");
    if (!timezone.trim()) return alert("Välj eller skriv en tidszon");

    const city: City = {
      id: makeId(),
      name: name.trim(),
      country: country.trim() || undefined,
      timezone: timezone,
    };

    onAdd(city);
    setName("");
    setCountry("");
    // behåll timezone för snabb flera inläggningar
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2 items-end">
      <label className="flex flex-col">
        <span className="text-sm text-slate-600">Stadsnamn</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
          placeholder="t.ex. Stockholm"
          required
        />
      </label>

      <label className="flex flex-col">
        <span className="text-sm text-slate-600">Land (valfritt)</span>
        <input
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="mt-1 p-2 border rounded w-full"
          placeholder="t.ex. Sverige"
        />
      </label>

      <label className="flex flex-col sm:col-span-2">
        <span className="text-sm text-slate-600">Tidszon (sök)</span>
        <SearchableTimezoneInput
          timezones={timezones}
          value={timezone}
          onChange={(tz) => setTimezone(tz)}
          placeholder="Skriv stad eller tidszon — välj från förslag"
        />
      </label>

      <div className="sm:col-span-2">
        <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700">Lägg till stad</button>
      </div>
    </form>
  );
}
