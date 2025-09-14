import React from "react";
import { useParams, Link } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { City, ClockMode } from "../types";
import { useWorldTimeApi } from "../hooks/useWorldTimeApi";

const CityPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cities] = useLocalStorage<City[]>("cities", []);
  const city = cities.find((c) => c.id === id);

  if (!city) return <p>Staden hittades inte</p>;

  const { data, loading, error } = useWorldTimeApi(city.timezone);

  return (
    <div
      className="city-page"
      style={{
        backgroundImage: `url(${city.imageUrl || "/default.jpg"})`,
        backgroundSize: "cover",
        minHeight: "100vh",
        color: "white",
        padding: "2rem"
      }}
    >
      <h1>{city.name}</h1>
      {loading && <p>Laddar tid...</p>}
      {error && <p>{error}</p>}
      {data && <h2>{new Date(data.dateTime).toLocaleTimeString()}</h2>}
      <Link to="/">⬅ Tillbaka</Link>
    </div>
  );
};

export default CityPage;
