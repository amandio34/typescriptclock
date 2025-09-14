// src/components/SearchableTimezoneInput.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  timezones?: string[] | null;
  value: string;
  onChange: (tz: string) => void;
  placeholder?: string;
  maxSuggestions?: number;
}

export default function SearchableTimezoneInput({
  timezones,
  value,
  onChange,
  placeholder = "Sök tidszon (t.ex. Stockholm eller Europe/Stockholm)",
  maxSuggestions = 8,
}: Props) {
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Uppdatera query om parent skickar nytt value
  useEffect(() => setQuery(value || ""), [value]);

  // Filtrera förslag
  const suggestions = useMemo(() => {
    if (!timezones || !query.trim()) return [];
    const q = query.toLowerCase();
    // matcha både "City" del och full tidszons-sträng
    const filtered = timezones.filter((t) => {
      return t.toLowerCase().includes(q)
        || t.split("/").pop()?.toLowerCase().includes(q);
    });
    return filtered.slice(0, maxSuggestions);
  }, [timezones, query, maxSuggestions]);

  // click outside stänger dropdown
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // keyboard navigation
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (open && suggestions[highlight]) {
        selectTimezone(suggestions[highlight]);
        e.preventDefault();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  function selectTimezone(tz: string) {
    setQuery(tz);
    onChange(tz);
    setOpen(false);
    inputRef.current?.blur();
  }

  return (
    <div ref={ref} className="relative">
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); setHighlight(0); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="mt-1 p-2 border rounded w-full"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls="tz-listbox"
      />

      {open && suggestions.length > 0 && (
        <ul
          id="tz-listbox"
          role="listbox"
          className="absolute z-20 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-auto text-sm"
        >
          {suggestions.map((tz, i) => (
            <li
              role="option"
              aria-selected={highlight === i}
              key={tz}
              onMouseDown={(e) => { e.preventDefault(); selectTimezone(tz); }}
              onMouseEnter={() => setHighlight(i)}
              className={`px-3 py-2 cursor-pointer ${highlight === i ? "bg-sky-50" : "hover:bg-slate-50"}`}
            >
              <div className="font-medium">{tz.split("/").pop()}</div>
              <div className="text-xs text-slate-500">{tz}</div>
            </li>
          ))}
        </ul>
      )}

      {open && query.trim() && suggestions.length === 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white border rounded shadow p-2 text-sm text-slate-500">
          Inga förslag
        </div>
      )}
    </div>
  );
}
