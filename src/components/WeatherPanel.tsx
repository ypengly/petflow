import { useCallback, useEffect, useState } from "react";
import { LocateFixed, Search } from "lucide-react";
import { describe, getWeather, searchPlace, type Weather } from "../shared/weather";
import { updateSettings, useSettings, type Place } from "../shared/store";

export default function WeatherPanel({ onReact }: { onReact: (w: Weather) => void }) {
  const s = useSettings();
  const [w, setW] = useState<Weather | null>(null); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const [q, setQ] = useState(""); const [res, setRes] = useState<Place[]>([]);
  const load = useCallback(async (p: Place) => {
    setBusy(true); setErr("");
    try { const x = await getWeather(p); setW(x); onReact(x); } catch { setErr("Weather is unavailable right now. Check your connection."); } finally { setBusy(false); }
  }, [onReact]);
  useEffect(() => { if (s.location) void load(s.location); }, [s.location, load]);
  const find = async () => { setErr(""); try { const r = await searchPlace(q); setRes(r); if (!r.length) setErr("No places found."); } catch { setErr("Location search is unavailable right now."); } };
  const locate = () => navigator.geolocation?.getCurrentPosition(
    (p) => updateSettings({ location: { name: "My location", lat: Math.round(p.coords.latitude * 100) / 100, lon: Math.round(p.coords.longitude * 100) / 100 } }),
    () => setErr("Location permission was denied. Search for a place instead."));
  const d = w ? describe(w.code) : null;
  return (
    <div className="text-left text-sm">
      <div className="flex gap-1">
        <input aria-label="Search location" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && find()} placeholder="City name" className="w-full rounded-full border border-ink/20 px-3 py-1" />
        <button aria-label="Search" onClick={find} className="rounded-full bg-lavender p-2"><Search size={14} /></button>
        <button aria-label="Use my location" onClick={locate} className="rounded-full bg-lavender p-2"><LocateFixed size={14} /></button>
      </div>
      {res.map((p) => <button key={p.name + p.lat} className="mt-1 block w-full truncate rounded-lg px-2 py-1 text-left hover:bg-lavender" onClick={() => { updateSettings({ location: p }); setRes([]); }}>{p.name}</button>)}
      {err && <p role="alert" className="mt-2 text-red-600">{err}</p>}
      {busy && <p className="mt-2">Loading…</p>}
      {w && d && !busy && (
        <div className="mt-2">
          <p className="truncate font-semibold">{s.location?.name}</p>
          <p className="font-display text-3xl font-bold">{Math.round(w.temp)}°C <span className="text-base font-semibold">{d.label}</span></p>
          <p>Wind {Math.round(w.wind)} km/h · Rain {w.precip} mm</p>
          <ul className="mt-2 grid grid-cols-3 gap-1 text-center">{w.daily.slice(1, 4).map((x) => <li key={x.date} className="rounded-xl bg-mint p-1"><b>{new Date(x.date).toLocaleDateString([], { weekday: "short" })}</b><br />{Math.round(x.max)}° / {Math.round(x.min)}°<br />{describe(x.code).label}</li>)}</ul>
        </div>
      )}
      {!w && !busy && !err && <p className="mt-2">Pick a location to see the weather. Location is only requested when you tap the locate button.</p>}
    </div>
  );
}
