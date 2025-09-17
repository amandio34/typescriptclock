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
  // Local state for the input query and dropdown state
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const ref = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sync local query state with external value prop
  useEffect(() => setQuery(value || ""), [value]);

  // Compute filtered suggestions based on the query
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

  // Close dropdown when clicking outside the component
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // Keyboard navigation for the dropdown
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

  // Select a timezone from the dropdown
  function selectTimezone(tz: string) {
    setQuery(tz);
    onChange(tz);
    setOpen(false);
    inputRef.current?.blur();
  }

  return (
    <section ref={ref} className="relative">
      {/* Input field for searching timezones */}
      <fieldset className="border-0 p-0 m-0">
        <legend className="sr-only">Timezone Search</legend>
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
      </fieldset>

      {/* Dropdown with suggestions */}
      {open && (
        <section className="absolute z-30 mt-1 w-full bg-white border rounded shadow max-h-72 overflow-auto text-sm">
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
                    <output className="font-medium">{cityLabel}</output>
                    <output className="text-xs text-slate-500">{tz}</output>
                  </li>
                );
              })}
            </ul>
          ) : (
            <output className="p-3 text-sm text-slate-500">Inga förslag</output>
          )}
        </section>
      )}
    </section>
  );
}
