import { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PetStage from "../components/PetStage";
import { getPet, PETS } from "../shared/pets/registry";
import { updateSettings, useSettings } from "../shared/store";

const BGS = [["Cream", "#FFF9F0"], ["Mint", "#DDF5E8"], ["Lavender", "#E9E0FF"], ["Night", "#303044"]] as const;
export default function Playground() {
  const [params] = useSearchParams(); const s = useSettings(); const ref = useRef<HTMLDivElement>(null);
  const [id, setId] = useState(getPet(params.get("pet") ?? "")?.id ?? s.active ?? "cat"); const [bg, setBg] = useState<string>(BGS[1][1]);
  const def = getPet(id)!;
  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="text-4xl font-bold">Pet playground</h1>
      <p className="mt-1">Click the pet for its menu, drag it around, and try the clock and countdown.</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_18rem]">
        <div ref={ref} className="relative h-[28rem] overflow-hidden rounded-[2rem] shadow-soft" style={{ background: bg }}>
          <PetStage key={id} def={def} size={160 * s.size} speed={s.speed} autonomy={s.autonomy} constraints={ref} />
        </div>
        <div className="space-y-4 rounded-3xl bg-white p-5 shadow-soft">
          <label className="block font-semibold">Pet<select value={id} onChange={(e) => setId(e.target.value)} className="mt-1 w-full rounded-xl border border-ink/20 p-2">{PETS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
          <label className="block font-semibold">Size<input type="range" min={0.6} max={2} step={0.1} value={s.size} onChange={(e) => updateSettings({ size: +e.target.value })} className="w-full" /></label>
          <label className="block font-semibold">Animation speed<input type="range" min={0.5} max={2} step={0.1} value={s.speed} onChange={(e) => updateSettings({ speed: +e.target.value })} className="w-full" /></label>
          <label className="flex items-center gap-2 font-semibold"><input type="checkbox" checked={s.autonomy} onChange={(e) => updateSettings({ autonomy: e.target.checked })} /> Autonomous behavior</label>
          <div><p className="font-semibold">Background</p><div className="mt-1 flex gap-2">{BGS.map(([n, c]) => <button key={n} aria-label={n} onClick={() => setBg(c)} className="h-8 w-8 rounded-full border-2 border-ink/30" style={{ background: c }} />)}</div></div>
          <button className="btn-primary w-full" onClick={() => updateSettings({ active: id })}>Activate pet on this site</button>
          {s.active && <button className="btn-soft w-full" onClick={() => updateSettings({ active: null })}>Hide active pet</button>}
        </div>
      </div>
    </section>
  );
}
