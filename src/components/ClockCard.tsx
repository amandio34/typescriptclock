// src/components/ClockCard.tsx
import React, { useEffect, useState } from "react";
import type { City, ClockMode } from "../types";
import { useWorldTimeApi } from "../hooks/useWorldTimeApi";
import { Link } from "react-router-dom";
import { useInterval } from "../hooks/useInterval";
import { useLocalStorage } from "../hooks/useLocalStorage";
import AnalogClock from "./AnalogClock";

interface Props {
  city: City;
}

const ClockCard: React.FC<Props> = ({ city }) => {
  const { data, loading, error } = useWorldTimeApi(city.timezone);

  const storageKey = `clock_mode_${city.id}`;
  const [savedMode, setSavedMode] = useLocalStorage<ClockMode>(storageKey, "digital");
  const [mode, setMode] = useState<ClockMode>(savedMode ?? "digital");

  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    if (data?.dateTime) {
      setNow(new Date(data.dateTime));
    }
  }, [data?.dateTime]);

  useInterval(() => {
    setNow((prev) => new Date(prev.getTime() + 1000));
  }, 1000);

  useEffect(() => {
    setSavedMode(mode);
  }, [mode, setSavedMode]);

  if (loading) return <div className="p-4">Laddar tid...</div>;
  if (error || !data) return <div className="p-4">Kunde inte ladda tid</div>;

  return (
    <article className="clock-card bg-white p-4 rounded shadow">
      <header className="flex items-baseline justify-between">
        <h3 className="text-lg font-medium">{city.name}</h3>
        <div className="text-sm text-slate-500">{data.timeZone}</div>
      </header>

      <div className="my-3">
        {mode === "digital" ? (
          <div className="text-2xl font-mono">{now.toLocaleTimeString()}</div>
        ) : (
          <AnalogClock date={now} size={120} />
        )}
      </div>

      <footer className="flex gap-3 items-center">
        <button
          onClick={() => setMode(mode === "digital" ? "analog" : "digital")}
          className="px-3 py-1 bg-sky-600 text-white rounded"
        >
          Växla vy
        </button>
        <Link to={`/city/${city.id}`} className="text-sm text-slate-600 ml-auto">Detaljvy →</Link>
      </footer>
    </article>
  );
};

export default ClockCard;
