// import React, { useState } from "react";
// import type { City, ClockMode } from "../types";
// import { useWorldTimeApi } from "../hooks/useWorldTimeApi";

// interface Props {
//   city: City;
// }

// const ClockCard: React.FC<Props> = ({ city }) => {
//   const { data, loading, error } = useWorldTimeApi(city.timezone);
//   const [mode, setMode] = useState<ClockMode>("digital");

//   if (loading) return <p>Laddar tid...</p>;
//   if (error || !data) return <p>Kunde inte ladda tid</p>;

//   const date = new Date(data.dateTime);

//   return (
//     <div className="flex flex-col items-center space-y-2">
//       <h3 className="text-xl font-semibold">{city.name}</h3>
//       {mode === "digital" ? (
//         <p className="text-2xl font-mono">{date.toLocaleTimeString()}</p>
//       ) : (
//         <p>[Analog klocka kan ritas här]</p>
//       )}
//       <button
//         onClick={() => setMode(mode === "digital" ? "analog" : "digital")}
//         className="px-3 py-1 bg-sky-600 text-white rounded hover:bg-sky-700 text-sm"
//       >
//         Växla vy
//       </button>
//     </div>
//   );
// };

// export default ClockCard;

// src/components/ClockCard.tsx
import React, { useState } from "react";
import type { City, ClockMode } from "../types";
import { useTimezoneClock } from "../hooks/useTimezoneClock";

interface Props {
  city: City;
}

const ClockCard: React.FC<Props> = ({ city }) => {
  const [mode, setMode] = useState<ClockMode>("digital");
  const time = useTimezoneClock(String(city.timezone), { showSeconds: true, twelveHour: false });

  return (
    <article className="clock-card bg-white rounded-lg p-4 shadow-sm flex flex-col items-center space-y-3">
      <h3 className="text-lg font-medium">{city.name}</h3>
      <div className="text-2xl font-mono">{mode === "digital" ? (time || "–") : "[Analog klocka]"}</div>

      <div className="flex gap-2">
        <button
          onClick={() => setMode(mode === "digital" ? "analog" : "digital")}
          className="px-3 py-1 bg-sky-600 text-white rounded hover:bg-sky-700 text-sm"
        >
          Växla vy
        </button>
      </div>
    </article>
  );
};

export default ClockCard;
