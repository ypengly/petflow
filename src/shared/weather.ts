import type { Place } from "./store";
export interface Weather { temp: number; wind: number; precip: number; code: number; daily: { date: string; max: number; min: number; code: number }[] }
interface GeoResult { name: string; admin1?: string; country?: string; latitude: number; longitude: number }

export async function searchPlace(q: string): Promise<Place[]> {
  const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5`);
  if (!r.ok) throw new Error("geocoding failed");
  const j = (await r.json()) as { results?: GeoResult[] };
  return (j.results ?? []).map((x) => ({ name: [x.name, x.admin1, x.country].filter(Boolean).join(", "), lat: x.latitude, lon: x.longitude }));
}
export async function getWeather(p: Place): Promise<Weather> {
  const u = `https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}&current=temperature_2m,wind_speed_10m,precipitation,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=4&timezone=auto`;
  const r = await fetch(u); if (!r.ok) throw new Error("forecast failed");
  const j = await r.json() as { current: { temperature_2m: number; wind_speed_10m: number; precipitation: number; weather_code: number }; daily: { time: string[]; weather_code: number[]; temperature_2m_max: number[]; temperature_2m_min: number[] } };
  return { temp: j.current.temperature_2m, wind: j.current.wind_speed_10m, precip: j.current.precipitation, code: j.current.weather_code,
    daily: j.daily.time.map((d, i) => ({ date: d, max: j.daily.temperature_2m_max[i], min: j.daily.temperature_2m_min[i], code: j.daily.weather_code[i] })) };
}
export type Mood = "sunny" | "cloud" | "rain" | "snow" | "other";
export function describe(code: number): { label: string; mood: Mood } {
  if (code === 0) return { label: "Clear sky", mood: "sunny" };
  if (code <= 2) return { label: "Partly cloudy", mood: "sunny" };
  if (code === 3) return { label: "Overcast", mood: "cloud" };
  if (code === 45 || code === 48) return { label: "Fog", mood: "cloud" };
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return { label: "Rain", mood: "rain" };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { label: "Snow", mood: "snow" };
  if (code >= 95) return { label: "Thunderstorm", mood: "rain" };
  return { label: "Unknown", mood: "other" };
}
