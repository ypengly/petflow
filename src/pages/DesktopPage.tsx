import { Check, X } from "lucide-react";
import { invoke, isTauri } from "../shared/native";
import { getSettings, updateSettings, useSettings } from "../shared/store";

const ROWS: [string, boolean, boolean][] = [
  ["Pets, menu, autonomy", true, true], ["Clock, weather, timers", true, true], ["Pet stays visible over other apps", false, true],
  ["Transparent always-on-top overlay", false, true], ["Click-through mode", false, true], ["Multi-monitor movement", false, true], ["Start with Windows", false, true],
];
export default function DesktopPage() {
  const s = useSettings(); const tauri = isTauri();
  const start = async () => { const g = getSettings(); if (!g.active) updateSettings({ active: "cat" }); await invoke("start_overlay", { x: g.pos?.x, y: g.pos?.y, alwaysOnTop: g.alwaysOnTop, clickThrough: g.clickThrough }); updateSettings({ overlayOn: true }); };
  const stop = async () => { await invoke("stop_overlay"); updateSettings({ overlayOn: false }); };
  return (
    <section className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-4xl font-bold">Desktop app</h1>
      <p className="mt-3">Keep your pet floating above your other windows on Windows 10 and 11.</p>
      {tauri ? (
        <div className="mt-6 flex flex-wrap gap-3 rounded-3xl bg-mint p-6">
          <button className="btn-primary" onClick={start} disabled={s.overlayOn}>Start desktop pet</button>
          <button className="btn-soft" onClick={stop} disabled={!s.overlayOn}>Stop desktop pet</button>
          <p className="w-full text-sm">You can minimize this window; the pet stays. Pick the pet on the Pets page first.</p>
        </div>
      ) : (
        <div className="mt-6 rounded-3xl bg-lavender p-6"><b>No installer is published yet.</b> Build it yourself with the steps below. A download link will be added here once a release exists.</div>
      )}
      <h2 className="mt-8 text-2xl font-bold">Web vs Desktop</h2>
      <table className="mt-3 w-full overflow-hidden rounded-2xl bg-white text-left shadow-soft">
        <thead className="bg-blush"><tr><th className="p-2">Feature</th><th>Web</th><th>Desktop</th></tr></thead>
        <tbody>{ROWS.map(([f, w, d]) => <tr key={f} className="border-t border-ink/10"><td className="p-2">{f}</td><td>{w ? <Check aria-label="Yes" size={18} /> : <X aria-label="No" size={18} />}</td><td>{d ? <Check aria-label="Yes" size={18} /> : <X aria-label="No" size={18} />}</td></tr>)}</tbody>
      </table>
      <h2 className="mt-8 text-2xl font-bold">Install (build from source)</h2>
      <ol className="mt-2 list-decimal space-y-1 pl-5"><li>Install Node.js 20+, Rust (rustup), Microsoft C++ Build Tools and WebView2.</li><li>Run <code>npm install</code>.</li><li>Run <code>npm run tauri build</code>.</li><li>Run the installer in <code>src-tauri/target/release/bundle/nsis/</code>.</li></ol>
      <h2 className="mt-8 text-2xl font-bold">Requirements</h2>
      <p>Windows 10 or 11 (64-bit), WebView2 runtime, 4 GB RAM, about 150 MB disk space. Version 1.0.0.</p>
    </section>
  );
}
