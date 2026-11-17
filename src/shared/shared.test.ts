import { describe as d, expect, it } from "vitest";
import { requestState } from "./engine/stateMachine";
import { nextPhase } from "./pomodoro";
import { describe as weatherDescribe } from "./weather";
import { PETS } from "./pets/registry";

d("state machine", () => {
  it("blocks actions while sleeping except wake", () => {
    expect(requestState("sleeping", "dancing")).toBeNull();
    expect(requestState("sleeping", "happy")?.returnTo).toBe("idle");
  });
  it("temporary states return to idle", () => expect(requestState("idle", "jumping")).toMatchObject({ returnTo: "idle" }));
});
d("pomodoro", () => {
  const c = { work: 25, short: 5, long: 15, every: 4 };
  it("alternates and gives a long break every 4th session", () => {
    expect(nextPhase("work", 0, c)).toMatchObject({ phase: "short", minutes: 5 });
    expect(nextPhase("work", 3, c)).toMatchObject({ phase: "long", minutes: 15, completed: 4 });
    expect(nextPhase("short", 1, c)).toMatchObject({ phase: "work", minutes: 25 });
  });
});
d("weather + registry", () => {
  it("maps WMO codes", () => { expect(weatherDescribe(0).mood).toBe("sunny"); expect(weatherDescribe(63).mood).toBe("rain"); });
  it("has 12 unique pets", () => expect(new Set(PETS.map((p) => p.id)).size).toBe(12));
});
