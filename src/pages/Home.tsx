// src/pages/Home.tsx
import React, { useCallback } from "react";
import AddCityForm from "../components/AddCityForm";
import ClockCard from "../components/ClockCard";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useTimezones } from "../hooks/useTimezones";
import type { City } from "../types";

/** Helper: makes a readable city string from timezone id */
function tzToName(tz: string) {
  // Takes the last part after "/", replaces "_" with " " and capitalizes
  const part = tz.split("/").pop() ?? tz;
  return part.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const Home: React.FC = () => {
  const [cities, setCities] = useLocalStorage<City[]>("cities", []);
  const { timezones, loading, error } = useTimezones();

  // Search state (separate from form)
  const [search, setSearch] = React.useState("");
  // Filter for dropdown (max 8)
  const filtered =
    search.trim() && timezones
      ? timezones.filter((tz) => tz.toLowerCase().includes(search.toLowerCase())).slice(0, 8)
      : [];

  // Add city (used by both form and direct from search)
  const addCity = useCallback((city: City) => {
    // Duplicate check: same name or same timezone
    const exists = cities.some(
      (c) =>
        c.timezone === city.timezone ||
        c.name.trim().toLowerCase() === city.name.trim().toLowerCase()
    );
    if (exists) {
      alert("En stad med samma namn eller tidszon finns redan.");
      return;
    }
    setCities((prev) => [...prev, city]);
  }, [cities, setCities]);

  // Add directly when user clicks a search suggestion
  const handleSuggestionClick = (tz: string) => {
    const name = tzToName(tz);
    const id = `${tz}-${Date.now()}`; // unique id
    const city: City = { id, name, timezone: tz };
    addCity(city);
    setSearch(""); // clear search field
  };

  const handleDelete = useCallback((id: string) => {
    setCities((prev) => prev.filter((c) => c.id !== id));
  }, [setCities]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-sky-200 p-6">
      <section className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl text-center space-y-8">
        <header>
          <h1 className="text-3xl font-bold mb-2">🌍 World Clock</h1>
          <p className="text-slate-600">Håll koll på tider runt om i världen.</p>
        </header>

        {/* --- Search city (INDEPENDENT) --- */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Sök stad</h2>
          {loading && <p className="text-sm text-slate-500">Laddar tidszoner…</p>}
          {error && <p className="text-sm text-amber-600">{error}</p>}

          <fieldset className="relative border-0 p-0 m-0">
            <legend className="sr-only">Sök tidszon</legend>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Sök tidszon (t.ex. London eller Europe/London)"
              className="w-full p-2 border rounded"
            />
            {filtered.length > 0 && (
              <ul className="absolute z-10 bg-white border rounded mt-1 w-full max-h-40 overflow-y-auto shadow-lg text-left">
                {filtered.map((tz) => (
                  <li
                    key={tz}
                    onClick={() => handleSuggestionClick(tz)}
                    className="px-3 py-2 cursor-pointer hover:bg-sky-100"
                  >
                    <span className="font-medium">{tzToName(tz)}</span>
                    <span className="text-xs text-slate-400 block">{tz}</span>
                  </li>
                ))}
              </ul>
            )}
          </fieldset>
          <p className="text-xs text-slate-400">Klicka på ett förslag för att lägga till staden direkt.</p>
        </section>

        {/* --- Add city (INDEPENDENT FORM) --- */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Lägg till stad</h2>
          <AddCityForm onAdd={(city) => addCity(city)} timezones={timezones} existingCities={cities} />
          <p className="text-xs text-slate-500">Du kan också fylla i formuläret och lägga till en egen stad manuellt.</p>
        </section>

        {/* --- Displayed cities --- */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Städer</h2>
          <section className="city-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cities.length === 0 ? (
              <p className="text-slate-500">Inga städer tillagda ännu.</p>
            ) : (
              cities.map((c) => <ClockCard key={c.id} city={c} onDelete={handleDelete} />)
            )}
          </section>
        </section>

        <footer className="text-xs text-slate-400">
          <p>Worldclock Inc® 2025</p>
        </footer>
      </section>
    </main>
  );
};

export default Home;
