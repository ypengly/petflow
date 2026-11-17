import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Search } from "lucide-react";
import { PETS } from "../shared/pets/registry";
import PetSprite from "../components/PetSprite";
import { updateSettings, useSettings } from "../shared/store";
import type { PetCategory } from "../shared/types";

const CATS: ("all" | "favorites" | PetCategory)[] = ["all", "favorites", "furry", "wild", "water", "fantasy"];
export default function Pets() {
  const s = useSettings(); const [q, setQ] = useState(""); const [cat, setCat] = useState<(typeof CATS)[number]>("all");
  const [hover, setHover] = useState<string | null>(null);
  const list = useMemo(() => PETS.filter((p) => (cat === "all" || (cat === "favorites" ? s.favorites.includes(p.id) : p.category === cat)) && (p.name + p.personality).toLowerCase().includes(q.toLowerCase())), [q, cat, s.favorites]);
  const fav = (id: string) => updateSettings({ favorites: s.favorites.includes(id) ? s.favorites.filter((x) => x !== id) : [...s.favorites, id] });
  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="text-4xl font-bold">Choose your pet</h1>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-soft"><Search size={16} /><input aria-label="Search pets" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pets" className="bg-transparent outline-none" /></label>
        {CATS.map((c) => <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} className={`rounded-full px-4 py-2 font-display font-medium capitalize ${cat === c ? "bg-ink text-cream" : "bg-lavender"}`}>{c}</button>)}
      </div>
      {list.length === 0 && <p className="mt-10 text-center">No pets match. Try another search or filter.</p>}
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <li key={p.id} onMouseEnter={() => setHover(p.id)} onMouseLeave={() => setHover(null)} className="relative rounded-3xl bg-white p-5 shadow-soft">
            <button aria-label={`Favorite ${p.name}`} aria-pressed={s.favorites.includes(p.id)} onClick={() => fav(p.id)} className="absolute right-4 top-4"><Heart className={s.favorites.includes(p.id) ? "fill-pink-400 text-pink-400" : ""} /></button>
            <div className="grid place-items-center rounded-2xl py-4" style={{ background: p.palette.body + "55" }}><PetSprite def={p} size={150} state={hover === p.id ? "dancing" : "idle"} /></div>
            <h2 className="mt-3 text-2xl font-bold">{p.name}</h2>
            <p className="font-semibold">{p.personality}</p><p className="text-sm text-ink/70">{p.description}</p>
            <p className="mt-2 text-xs text-ink/60">Animations: {p.animations.join(", ")}</p>
            <div className="mt-3 flex gap-2">
              <button className="btn-primary !py-2 text-sm" onClick={() => updateSettings({ active: p.id })}>{s.active === p.id ? "Selected" : "Select pet"}</button>
              <Link className="btn-soft !py-2 text-sm" to={`/playground?pet=${p.id}`}>Preview</Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
