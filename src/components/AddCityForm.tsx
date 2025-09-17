import React, { useState, useEffect } from "react";
import type { City } from "../types";

interface Props {
  onAdd: (city: City) => void;
  timezones?: string[] | null;
}

export default function AddCityForm({ onAdd, timezones }: Props) {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [timezone, setTimezone] = useState("");
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<string[]>([]);

  // Filtrera tidszoner när query ändras
  useEffect(() => {
    if (!timezones || query.trim() === "") {
      setFiltered([]);
      return;
    }
    const q = query.toLowerCase();
    setFiltered(
      timezones.filter((tz) => tz.toLowerCase().includes(q)).slice(0, 10) // max 10 träffar
    );
  }, [query, timezones]);

  function makeId() {
    if (typeof crypto !== "undefined" && (crypto as any).randomUUID)
      return (crypto as any).randomUUID();
    return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !timezone.trim()) {
      return alert("Ange både stad och tidszon");
    }

    const city: City = {
      id: makeId(),
      name: name.trim(),
      country: country.trim() || undefined,
      timezone,
    };

    onAdd(city);
    setName("");
    setCountry("");
    setTimezone("");
    setQuery("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-4 w-full"
    >
      {/* Stad */}
      <div className="w-full">
        <label className="block text-sm text-slate-600 mb-1">Stadsnamn</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="t.ex. Stockholm"
          required
        />
      </div>

      {/* Land */}
      <div className="w-full">
        <label className="block text-sm text-slate-600 mb-1">
          Land (valfritt)
        </label>
        <input
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="t.ex. Sverige"
        />
      </div>

      {/* Autocomplete för tidszon */}
      <div className="w-full relative">
        <label className="block text-sm text-slate-600 mb-1">
          Tidszon (sök)
        </label>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setTimezone(e.target.value);
          }}
          className="w-full p-2 border rounded"
          placeholder="Börja skriva..."
        />

        {filtered.length > 0 && (
          <ul className="absolute z-10 bg-white border rounded mt-1 w-full max-h-40 overflow-y-auto shadow-lg">
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
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700"
      >
        Lägg till stad
      </button>
    </form>
  );
}
