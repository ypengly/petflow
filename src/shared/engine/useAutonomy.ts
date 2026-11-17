import { useEffect } from "react";
import type { AnimationState, PetDefinition } from "../types";
const OPTIONS: AnimationState[] = ["jumping", "sitting", "waving", "dancing", "sleeping"];
export function useAutonomy(def: PetDefinition, enabled: boolean, get: () => AnimationState, request: (s: AnimationState) => void, paused: boolean) {
  useEffect(() => {
    if (!enabled || paused || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let last = Date.now(); let prev: AnimationState | null = null;
    const id = window.setInterval(() => {
      if (document.hidden || get() !== "idle" || Date.now() - last < def.behavior.cooldownMs || Math.random() > 0.5) return;
      const w = OPTIONS.filter((o) => o !== prev).map((o) => [o, (def.behavior[o] ?? 0.1)] as const);
      let r = Math.random() * w.reduce((a, [, x]) => a + x, 0);
      const pick = (w.find(([, x]) => (r -= x) <= 0) ?? w[0])[0];
      prev = pick; last = Date.now(); request(pick);
      if (pick === "sitting" || pick === "sleeping")
        window.setTimeout(() => { if (get() === pick) request(pick === "sleeping" ? "happy" : "idle"); }, 7000);
    }, 4000);
    return () => window.clearInterval(id);
  }, [def, enabled, paused, get, request]);
}
