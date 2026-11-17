import { updateSettings, resetSettings, useSettings, type Settings as S } from "../shared/store";
import { invoke, isTauri } from "../shared/native";

export default function SettingsPage() {
  const s = useSettings(); const tauri = isTauri();
  const Toggle = ({ k, label, desktop, after }: { k: keyof S; label: string; desktop?: boolean; after?: (v: boolean) => void }) => (
    <label className={`flex items-center justify-between gap-3 rounded-2xl bg-white p-3 shadow-soft ${desktop && !tauri ? "opacity-50" : ""}`}>
      <span className="font-semibold">{label}{desktop && !tauri && <span className="ml-2 text-xs font-normal">(desktop app only)</span>}</span>
      <input type="checkbox" disabled={desktop && !tauri} checked={Boolean(s[k])} onChange={(e) => { updateSettings({ [k]: e.target.checked } as Partial<S>); after?.(e.target.checked); }} className="h-5 w-5" />
    </label>
  );
  const Range = ({ k, label, min, max }: { k: "size" | "speed"; label: string; min: number; max: number }) => (
    <label className="block rounded-2xl bg-white p-3 font-semibold shadow-soft">{label}: {s[k].toFixed(1)}x<input type="range" min={min} max={max} step={0.1} value={s[k]} onChange={(e) => updateSettings({ [k]: +e.target.value })} className="w-full" /></label>
  );
  return (
    <section className="mx-auto max-w-2xl space-y-3 px-5 py-12">
      <h1 className="text-4xl font-bold">Settings</h1>
      <p>Saved on this device only. No account needed.</p>
      <Range k="size" label="Pet size" min={0.6} max={2} /><Range k="speed" label="Animation speed" min={0.5} max={2} />
      <Toggle k="sound" label="Sound" /><Toggle k="autonomy" label="Autonomous behavior" /><Toggle k="weather" label="Weather" /><Toggle k="clock" label="Clock" />
      <Toggle k="reducedMotion" label="Reduced motion" /><Toggle k="restore" label="Restore previous pet" />
      <Toggle k="alwaysOnTop" label="Always on top" desktop after={(v) => void invoke("set_always_on_top", { on: v })} />
      <Toggle k="clickThrough" label="Click-through mode (pet ignores the mouse)" desktop after={(v) => void invoke("set_click_through", { on: v })} />
      <Toggle k="autostart" label="Start with Windows" desktop after={(v) => void invoke(v ? "plugin:autostart|enable" : "plugin:autostart|disable")} />
      <div className="flex flex-wrap gap-3 pt-2">
        {s.active && <button className="btn-soft" onClick={() => updateSettings({ active: null })}>Hide pet</button>}
        <button className="btn-primary" onClick={() => { if (confirm("Reset all settings?")) resetSettings(); }}>Reset settings</button>
      </div>
      <h2 className="pt-6 text-2xl font-bold">Privacy</h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>No accounts, logins, analytics or tracking.</li>
        <li>Settings and favorites are stored in your browser or app storage only.</li>
        <li>Weather uses Open-Meteo. Only a place name search or rounded coordinates are sent, and only when you ask for weather.</li>
        <li>Your location is requested only when you tap the locate button.</li>
        <li>No API keys are used or embedded.</li>
      </ul>
    </section>
  );
}
