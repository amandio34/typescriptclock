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

  useEffect(() => setQuery(value || ""), [value]);

  const suggestions = useMemo(() => {
    if (!timezones) return [];
    const q = (query || "").trim().toLowerCase();
    if (!q) return timezones.slice(0, maxSuggestions);
    const filtered = timezones.filter((t) => {
      const cityPart = t.split("/").pop() ?? t;
      return t.toLowerCase().includes(q) || cityPart.toLowerCase().includes(q);
    });
    return filtered.slice(0, maxSuggestions);
  }, [timezones, query, maxSuggestions]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

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
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setOpen(true);
          setHighlight(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="mt-1 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-sky-200"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls="tz-listbox"
      />

      {open && (
        <div className="absolute z-30 mt-1 w-full bg-white border rounded shadow max-h-72 overflow-auto text-sm">
          {suggestions.length > 0 ? (
            <ul
              role="listbox"
              id="tz-listbox"
              className="list-none divide-y divide-slate-100 m-0 p-0"
            >
              {suggestions.map((tz, i) => {
                const cityLabel = tz.split("/").pop() ?? tz;
                return (
                  <li
                    role="option"
                    aria-selected={highlight === i}
                    key={tz}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectTimezone(tz);
                    }}
                    onMouseEnter={() => setHighlight(i)}
                    className={`px-3 py-2 cursor-pointer ${
                      highlight === i ? "bg-sky-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="font-medium">{cityLabel}</div>
                    <div className="text-xs text-slate-500">{tz}</div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="p-3 text-sm text-slate-500">Inga förslag</div>
          )}
        </div>
      )}
    </div>
  );
}
