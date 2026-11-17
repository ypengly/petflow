import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { motion, useMotionValue } from "framer-motion";
import { Clock, CloudSun, Crosshair, EyeOff, Hourglass, Moon, PartyPopper, Play, RotateCw, Settings as Cog, Sparkles, Utensils, Hand, ArrowUp, Armchair, X } from "lucide-react";
import PetSprite from "./PetSprite";
import WeatherPanel from "./WeatherPanel";
import { usePetState } from "../shared/engine/usePetState";
import { useAutonomy } from "../shared/engine/useAutonomy";
import { useCountdown } from "../shared/timer";
import { nextPhase, type Phase } from "../shared/pomodoro";
import { describe, type Weather } from "../shared/weather";
import { invoke } from "../shared/native";
import { beep } from "../shared/sound";
import { updateSettings, useSettings } from "../shared/store";
import type { AnimationState, PetDefinition } from "../shared/types";

interface Props { def: PetDefinition; size: number; speed: number; autonomy: boolean; constraints?: RefObject<HTMLElement>; onHide?: () => void; native?: boolean; onBusy?: (b: boolean) => void }
type Panel = null | "clock" | "timer" | "weather";
const PRESETS = [1, 5, 10, 15, 25, 30, 45, 60];
const fmt = (ms: number) => { const s = Math.ceil(ms / 1000); return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
const LABEL: Record<Phase, string> = { work: "Focus", short: "Short break", long: "Long break" };

export default function PetStage({ def, size, speed, autonomy, constraints, onHide, native, onBusy }: Props) {
  const cfg = useSettings();
  const { state, request, get } = usePetState(def.defaultAnimation);
  const [menu, setMenu] = useState(false); const [panel, setPanel] = useState<Panel>(null);
  const [say, setSay] = useState<string | null>(null); const [now, setNow] = useState(new Date());
  const [custom, setCustom] = useState(20); const [umbrella, setUmbrella] = useState(false);
  const [follow, setFollow] = useState(false); const [mode, setMode] = useState<"timer" | "pomo">("timer");
  const [phase, setPhase] = useState<Phase>("work"); const [done, setDone] = useState(0);
  const ref = useRef<HTMLDivElement>(null); const sayT = useRef<number>(); const mouse = useRef<{ x: number; y: number } | null>(null);
  const x = useMotionValue(0); const y = useMotionValue(0); const down = useRef<{ x: number; y: number } | null>(null);

  const speak = useCallback((t: string) => { setSay(t); window.clearTimeout(sayT.current); sayT.current = window.setTimeout(() => setSay(null), 2600); }, []);
  const cd = useCountdown(() => {
    request("happy");
    if (cfg.sound) beep();
    if (mode === "pomo") {
      const n = nextPhase(phase, done, cfg.pomo); setPhase(n.phase); setDone(n.completed);
      speak(n.phase === "work" ? "Break over. Back to focus!" : `Nice work! ${LABEL[n.phase]} time.`);
      if ("Notification" in window && Notification.permission === "granted") new Notification("PetFlow", { body: `${LABEL[n.phase]} (${n.minutes} min)` });
      cd.start(n.minutes * 60);
    } else {
      speak("Time's up! Great focus!");
      if ("Notification" in window && Notification.permission === "granted") new Notification("PetFlow", { body: "Your timer is done." });
    }
  });
  const busy = menu || panel !== null;
  useAutonomy(def, autonomy, get, request, busy || cd.running || follow);
  useEffect(() => onBusy?.(busy), [busy, onBusy]);
  useEffect(() => () => window.clearTimeout(sayT.current), []);
  useEffect(() => { if (panel !== "clock") return; const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, [panel]);
  useEffect(() => {
    if (!menu) return;
    const close = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setMenu(false); };
    document.addEventListener("pointerdown", close); return () => document.removeEventListener("pointerdown", close);
  }, [menu]);
  const working = cd.running && (mode === "timer" || phase === "work");
  useEffect(() => { if (working && get() === "idle") request("working"); if (!working && get() === "working") request("idle"); }, [working, get, request]);
  useEffect(() => {
    if (!follow || cfg.reducedMotion || native) return;
    const mv = (e: PointerEvent) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    document.addEventListener("pointermove", mv); let raf = 0;
    const loop = () => {
      const r = ref.current?.getBoundingClientRect();
      if (r && mouse.current && !document.hidden) { const dx = mouse.current.x - (r.left + r.width / 2), dy = mouse.current.y - (r.top + r.height / 2); if (Math.hypot(dx, dy) > 90) { x.set(x.get() + dx * 0.03); y.set(y.get() + dy * 0.03); } }
      raf = requestAnimationFrame(loop);
    };
    loop(); return () => { cancelAnimationFrame(raf); document.removeEventListener("pointermove", mv); };
  }, [follow, cfg.reducedMotion, native, x, y]);
  useEffect(() => {
    if (!native || !autonomy || busy) return;
    let stop = false;
    const id = window.setInterval(async () => {
      if (get() !== "idle" || document.hidden) return;
      const dx = (Math.random() < 0.5 ? -1 : 1) * (60 + Math.random() * 120); request("walking");
      for (let i = 0; i < 12 && !stop; i++) { await invoke("move_overlay", { dx: dx / 12, dy: 0 }); await new Promise((r) => setTimeout(r, 100)); }
      if (get() === "walking") request("idle");
    }, 30000);
    return () => { stop = true; clearInterval(id); };
  }, [native, autonomy, busy, get, request]);

  const react = useCallback((w: Weather) => {
    const m = describe(w.code).mood; setUmbrella(m === "rain");
    if (m === "rain") speak("Rainy! I've got my umbrella."); else if (w.temp < 12) { request("surprised"); speak("Brrr, it's cold!"); }
    else if (m === "cloud") { request("bored"); speak("Cloudy… so sleepy."); } else if (m === "sunny") { request("happy"); speak("Sunny day!"); }
  }, [request, speak]);

  const act = (s: AnimationState, line: string) => () => { request(s); speak(line); setMenu(false); };
  const open = (p: Panel) => () => { setPanel(panel === p ? null : p); setMenu(false); };
  const sleeping = state === "sleeping";
  const items = [
    { i: PartyPopper, l: "Dance", f: act("dancing", "Watch these moves!") }, { i: ArrowUp, l: "Jump", f: act("jumping", "Boing!") },
    { i: Play, l: "Play", f: act("playing", "Wheee!") }, sleeping ? { i: Sparkles, l: "Wake up", f: act("happy", "Good morning!") } : { i: Moon, l: "Sleep", f: act("sleeping", "zzz…") },
    { i: Utensils, l: "Eat", f: act("eating", "Yum!") }, { i: Armchair, l: "Sit", f: act("sitting", "Cozy.") },
    { i: Hand, l: "Wave", f: act("waving", "Hello!") }, { i: RotateCw, l: "Spin", f: act("spinning", "Wheee!") },
    ...(native ? [] : [{ i: Crosshair, l: follow ? "Stop follow" : "Follow mouse", f: () => { setFollow(!follow); request(follow ? "idle" : "walking"); setMenu(false); } }]),
    ...(cfg.clock ? [{ i: Clock, l: "Clock", f: open("clock") }] : []),
    ...(cfg.weather ? [{ i: CloudSun, l: "Weather", f: open("weather") }] : []),
    { i: Hourglass, l: "Countdown", f: open("timer") },
    { i: Cog, l: "Settings", f: () => { setMenu(false); window.location.hash = "#/settings"; if (native) void invoke("show_main"); } },
    ...(onHide ? [{ i: EyeOff, l: "Hide pet", f: onHide }] : []),
  ];
  const start = (m: number) => { if ("Notification" in window && Notification.permission === "default") void Notification.requestPermission(); cd.start(m * 60); speak("Let's focus!"); };
  const startPomo = () => { setMode("pomo"); setPhase("work"); setDone(0); start(cfg.pomo.work); };
  const btn = "rounded-full bg-lavender px-3 py-1 text-sm font-semibold hover:bg-blush";
  const stop = { onPointerDown: (e: React.PointerEvent) => e.stopPropagation(), onClick: (e: React.MouseEvent) => e.stopPropagation() };
  const pomoInput = (k: keyof typeof cfg.pomo, label: string) => (
    <label className="flex items-center justify-between gap-2 text-xs">{label}<input type="number" min={1} max={180} value={cfg.pomo[k]} onChange={(e) => updateSettings({ pomo: { ...cfg.pomo, [k]: Math.max(1, Number(e.target.value) || 1) } })} className="w-14 rounded-full border border-ink/20 px-1 text-center" /></label>
  );
  const nativeDrag = native ? {
    onPointerDown: (e: React.PointerEvent) => { down.current = { x: e.clientX, y: e.clientY }; },
    onPointerMove: (e: React.PointerEvent) => { const d = down.current; if (d && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 5) { down.current = null; void invoke("drag_overlay"); } },
    onClick: () => setMenu((m) => !m),
  } : { onTap: () => setMenu((m) => !m) };

  return (
    <motion.div ref={ref} drag={!native} dragConstraints={constraints} dragMomentum={false} style={{ x, y }} {...nativeDrag}
      className="pointer-events-auto absolute bottom-3 left-1/2 z-20 w-fit -translate-x-1/2 cursor-grab touch-none">
      {say && <div role="status" className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-2xl bg-white px-3 py-1 text-sm font-semibold shadow-soft">{say}</div>}
      {panel && (
        <div {...stop} className="absolute bottom-full left-1/2 mb-12 w-64 -translate-x-1/2 cursor-default rounded-3xl bg-white p-4 text-center shadow-soft">
          <button aria-label="Close panel" className="absolute right-2 top-2" onClick={() => setPanel(null)}><X size={16} /></button>
          {panel === "clock" && (<>
            <p className="font-display text-3xl font-bold">{now.toLocaleTimeString([], { hour12: !cfg.h24, hour: "2-digit", minute: "2-digit", second: "2-digit" })}</p>
            <p className="text-sm">{now.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
            <button className={btn + " mt-2"} onClick={() => updateSettings({ h24: !cfg.h24 })}>{cfg.h24 ? "Use 12-hour" : "Use 24-hour"}</button>
            <div className="mt-2 grid grid-cols-7 gap-0.5 text-[10px]" aria-label="Calendar">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <b key={i}>{d}</b>)}
              {Array.from({ length: new Date(now.getFullYear(), now.getMonth(), 1).getDay() }, (_, i) => <span key={"b" + i} />)}
              {Array.from({ length: new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() }, (_, i) => <span key={i} className={i + 1 === now.getDate() ? "rounded-full bg-ink text-cream" : ""}>{i + 1}</span>)}
            </div>
          </>)}
          {panel === "weather" && <WeatherPanel onReact={react} />}
          {panel === "timer" && (cd.active ? (<>
            <p className="text-xs font-semibold">{mode === "pomo" ? `${LABEL[phase]} · session ${done + (phase === "work" ? 1 : 0)}` : "Countdown"}</p>
            <p className="font-display text-4xl font-bold">{fmt(cd.left)}</p>
            <div className="mx-auto mt-2 h-2 overflow-hidden rounded-full bg-lavender"><div className="h-full bg-ink" style={{ width: `${100 - (cd.left / cd.total) * 100}%` }} /></div>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {cd.running ? <button className={btn} onClick={cd.pause}>Pause</button> : cd.left > 0 ? <button className={btn} onClick={cd.resume}>Resume</button> : null}
              <button className={btn} onClick={() => cd.start(cd.total / 1000)}>Reset</button><button className={btn} onClick={() => { cd.reset(); setMode("timer"); }}>Cancel</button>
            </div>
          </>) : (<>
            <div className="mb-2 flex justify-center gap-1">{(["timer", "pomo"] as const).map((m) => <button key={m} aria-pressed={mode === m} onClick={() => setMode(m)} className={`${btn} ${mode === m ? "!bg-ink text-cream" : ""}`}>{m === "timer" ? "Timer" : "Pomodoro"}</button>)}</div>
            {mode === "timer" ? (<>
              <div className="flex flex-wrap justify-center gap-1">{PRESETS.map((m) => <button key={m} className={btn} onClick={() => start(m)}>{m}m</button>)}</div>
              <div className="mt-2 flex justify-center gap-2"><input aria-label="Custom minutes" type="number" min={1} max={600} value={custom} onChange={(e) => setCustom(Math.max(1, Number(e.target.value) || 1))} className="w-16 rounded-full border border-ink/20 px-2 text-center" /><button className={btn} onClick={() => start(custom)}>Start</button></div>
            </>) : (<div className="space-y-1">{pomoInput("work", "Work (min)")}{pomoInput("short", "Short break")}{pomoInput("long", "Long break")}{pomoInput("every", "Long break every")}<button className={btn + " mt-2"} onClick={startPomo}>Start Pomodoro</button></div>)}
          </>))}
        </div>
      )}
      {cd.active && <div className="absolute -right-2 -top-2 rounded-full bg-ink px-2 py-0.5 text-xs font-bold text-cream">{fmt(cd.left)}</div>}
      <PetSprite def={def} state={state} size={size} speed={speed} umbrella={umbrella} />
      {menu && (
        <div {...stop} className={`absolute top-0 grid w-48 cursor-default grid-cols-2 gap-1 rounded-3xl bg-white p-2 shadow-soft ${native ? "right-full mr-1" : "left-full ml-2"}`} role="menu">
          {items.map(({ i: Icon, l, f }) => <button key={l} role="menuitem" onClick={f} className="flex items-center gap-1 rounded-2xl px-2 py-2 text-left text-sm font-semibold hover:bg-lavender"><Icon size={16} /> {l}</button>)}
        </div>
      )}
    </motion.div>
  );
}
