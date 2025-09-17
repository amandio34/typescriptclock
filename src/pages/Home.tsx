import React, { useState } from "react";
import AddCityForm from "../components/AddCityForm";
import ClockCard from "../components/ClockCard";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useTimezones } from "../hooks/useTimezones";
import type { City } from "../types";

const Home: React.FC = () => {
  const [cities, setCities] = useLocalStorage<City[]>("cities", []);
  const { timezones, loading, error } = useTimezones();

  // För sökstad
  const [search, setSearch] = useState("");
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>(null);

  const handleAdd = (city: City) => {
    setCities([...cities, city]);
  };

  // Filtrera för sök dropdown
  const filtered =
    search.trim() && timezones
      ? timezones.filter((tz) =>
          tz.toLowerCase().includes(search.toLowerCase())
        ).slice(0, 8)
      : [];

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-sky-200 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl text-center space-y-8">
        <header>
          <h1 className="text-3xl font-bold mb-2">🌍 World Clock</h1>
          <p className="text-slate-600">
            Håll koll på tider runt om i världen.
          </p>
        </header>

        {/* --- Sök stad --- */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Sök stad</h2>
          {loading && <p className="text-sm text-slate-500">Laddar tidszoner…</p>}
          {error && <p className="text-sm text-amber-600">{error}</p>}

          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Börja skriva en världsdel/stad..."
              className="w-full p-2 border rounded"
            />
            {filtered.length > 0 && (
              <ul className="absolute z-10 bg-white border rounded mt-1 w-full max-h-40 overflow-y-auto shadow-lg text-left">
                {filtered.map((tz) => (
                  <li
                    key={tz}
                    onClick={() => {
                      setSelectedTimezone(tz);
                      setSearch(tz);
                    }}
                    className="px-3 py-2 cursor-pointer hover:bg-sky-100"
                  >
                    {tz}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* --- Lägg till stad --- */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Lägg till stad</h2>
          <AddCityForm onAdd={handleAdd} timezones={timezones} />
          <p className="text-xs text-slate-500">
            Ange namn och tidszon för att spara staden.
          </p>
        </section>

        {/* --- Vald stad --- */}
        {selectedTimezone && (
          <section className="space-y-3">
            <h2 className="text-xl font-semibold">Vald stad</h2>
            <ClockCard
              city={{
                id: selectedTimezone,
                name: search,
                timezone: selectedTimezone,
              }}
            />
          </section>
        )}

        <footer className="text-xs text-slate-400">
          <p>Data: worldtimeapi.org (fall-back används vid nätverksfel)</p>
        </footer>
      </div>
    </main>
  );
};

export default Home;
