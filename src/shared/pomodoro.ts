export type Phase = "work" | "short" | "long";
export interface PomoCfg { work: number; short: number; long: number; every: number }
export function nextPhase(phase: Phase, completed: number, c: PomoCfg): { phase: Phase; completed: number; minutes: number } {
  if (phase !== "work") return { phase: "work", completed, minutes: c.work };
  const n = completed + 1;
  return n % c.every === 0 ? { phase: "long", completed: n, minutes: c.long } : { phase: "short", completed: n, minutes: c.short };
}
