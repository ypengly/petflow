import { useEffect, useRef } from "react";
import PetStage from "../components/PetStage";
import { getPet } from "../shared/pets/registry";
import { invoke } from "../shared/native";
import { updateSettings, useSettings } from "../shared/store";

/** Rendered inside the transparent native Tauri window (?overlay=1). */
export default function Overlay() {
  const s = useSettings(); const ref = useRef<HTMLDivElement>(null);
  const def = getPet(s.active ?? "cat")!;
  useEffect(() => { document.documentElement.style.background = "transparent"; document.body.style.background = "transparent"; }, []);
  useEffect(() => { let t: number; let un: (() => void) | undefined; let dead = false;
    import("@tauri-apps/api/window").then(async (m) => { const w = m.getCurrentWindow(); const f = await w.onMoved((e) => { window.clearTimeout(t); t = window.setTimeout(() => updateSettings({ pos: { x: e.payload.x, y: e.payload.y } }), 400); }); if (dead) f(); else un = f; }).catch(() => {});
    return () => { dead = true; un?.(); window.clearTimeout(t); }; }, []);
  const busy = (b: boolean) => void invoke("resize_overlay", { expanded: b });
  return (
    <div ref={ref} className="fixed inset-0 overflow-hidden">
      <PetStage native def={def} size={150 * s.size} speed={s.speed} autonomy={s.autonomy && !s.reducedMotion} onBusy={busy}
        onHide={() => { updateSettings({ overlayOn: false }); void invoke("stop_overlay"); }} />
    </div>
  );
}
