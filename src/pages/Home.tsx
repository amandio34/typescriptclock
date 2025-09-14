import React, { useState } from "react";
import AddCityForm from "../components/AddCityForm";
import ClockCard from "../components/ClockCard";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useTimezones } from "../hooks/useTimezones";
import SearchableTimezoneInput from "../components/SearchableTimezoneInput";
import type { City } from "../types";

const Home: React.FC = () => {
  const [cities, setCities] = useLocalStorage<City[]>("cities", []);
  const { timezones, loading, error } = useTimezones();

  // Den tidszon som väljs i sidopanelen (kopplas till formuläret)
  const [selectedTimezone, setSelectedTimezone] = useState<string>("");

  const handleAdd = (city: City) => {
    setCities([...cities, city]);
    // efter tillägg kan vi nollställa valet om du vill:
    // setSelectedTimezone("");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <h1 className="text-3xl font-semibold">World Clock</h1>
        <p className="text-sm text-slate-500 mt-1">Håll koll på tider runt om i världen.</p>
      </header>

      <section className="max-w-4xl mx-auto grid gap-6 md:grid-cols-3">
        {/* Sidopanel: sökbar tidszon */}
        <aside className="md:col-span-1 bg-white rounded-lg p-4 shadow-sm">
          <h2 className="font-medium mb-2">Hitta tidszon</h2>

          {loading && <p className="text-sm text-slate-500">Laddar tidszoner…</p>}
          {error && <div className="mb-2 text-sm text-amber-700">Notis: {error}</div>}

          <p className="text-sm text-slate-500 mb-3">Skriv en stad eller tidszon — välj från förslag.</p>

          <SearchableTimezoneInput
            timezones={timezones}
            value={selectedTimezone}
            onChange={(tz) => setSelectedTimezone(tz)}
            placeholder="Sök tidszon (t.ex. Stockholm eller Europe/Stockholm)"
          />

          <p className="mt-4 text-xs text-slate-400">Tips: välj en tidszon här för att snabbt fylla i formuläret.</p>
        </aside>

        {/* Form och stadskort */}
        <article className="md:col-span-2 space-y-6">
          <section className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="font-medium mb-3">Lägg till stad</h2>
            {/* Passar in timezones + initialTimezone så formuläret kan förifylla */}
            <AddCityForm onAdd={handleAdd} timezones={timezones} initialTimezone={selectedTimezone} />
          </section>

          <section className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="font-medium mb-3">Städer</h2>
            <div className="city-grid grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cities.length === 0 ? (
                <p className="text-slate-500">Inga städer tillagda ännu.</p>
              ) : (
                cities.map((c) => <ClockCard key={c.id} city={c} />)
              )}
            </div>
          </section>
        </article>
      </section>

      <footer className="max-w-4xl mx-auto mt-8 text-xs text-slate-400">
        <p>Data: timeapi.io (fall-back används vid nätverksfel)</p>
      </footer>
    </main>
  );
};

export default Home;
