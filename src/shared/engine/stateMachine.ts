import type { AnimationState } from "../types";

/** States that play once, then return to idle (duration in ms). */
export const TEMPORARY: Partial<Record<AnimationState, number>> = {
  jumping: 800, waving: 1800, spinning: 1000, eating: 2400, playing: 3000,
  happy: 1800, surprised: 2500, bored: 4000, dancing: 4000,
};
/** States that persist until the user changes them. */
export const PERSISTENT: AnimationState[] = ["idle", "sleeping", "sitting", "working"];

export interface Transition { state: AnimationState; returnTo?: AnimationState; afterMs?: number }

/** Pure transition rule: sleeping can only be left via "happy" (wake up), preventing conflicts. */
export function requestState(current: AnimationState, next: AnimationState): Transition | null {
  if (current === next) return null;
  if (current === "sleeping" && next !== "happy" && next !== "idle") return null;
  const afterMs = TEMPORARY[next];
  return afterMs ? { state: next, returnTo: "idle", afterMs } : { state: next };
}
