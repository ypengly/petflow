import { useSyncExternalStore } from "react";
export interface Place { name: string; lat: number; lon: number }
export interface Settings {
  active: string | null; favorites: string[]; size: number; speed: number; autonomy: boolean;
  sound: boolean; weather: boolean; clock: boolean; reducedMotion: boolean; h24: boolean;
  alwaysOnTop: boolean; clickThrough: boolean; autostart: boolean; restore: boolean; overlayOn: boolean;
  location: Place | null; pos: { x: number; y: number } | null;
  pomo: { work: number; short: number; long: number; every: number };
}
const KEY = "petflow:v1";
export const DEFAULTS: Settings = {
  active: null, favorites: [], size: 1, speed: 1, autonomy: true, sound: true, weather: true, clock: true,
  reducedMotion: false, h24: false, alwaysOnTop: true, clickThrough: false, autostart: false, restore: true,
  overlayOn: false, location: null, pos: null, pomo: { work: 25, short: 5, long: 15, every: 4 },
};
const read = (): Settings => { try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return DEFAULTS; } };
let s: Settings = read();
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
if (typeof window !== "undefined") window.addEventListener("storage", (e) => { if (e.key === KEY) { s = read(); emit(); } });
export const getSettings = () => s;
export const useSettings = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => s);
export function updateSettings(p: Partial<Settings>) {
  s = { ...s, ...p };
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage unavailable */ }
  emit();
}
export const resetSettings = () => updateSettings({ ...DEFAULTS });
