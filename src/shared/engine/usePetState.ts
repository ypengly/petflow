import { useCallback, useEffect, useRef, useState } from "react";
import type { AnimationState } from "../types";
import { requestState } from "./stateMachine";

export function usePetState(initial: AnimationState = "idle") {
  const [state, setState] = useState<AnimationState>(initial);
  const stateRef = useRef(state);
  const timer = useRef<number>();

  const clear = () => { if (timer.current) window.clearTimeout(timer.current); };
  const set = useCallback((s: AnimationState) => { stateRef.current = s; setState(s); }, []);

  const request = useCallback((next: AnimationState) => {
    const t = requestState(stateRef.current, next);
    if (!t) return;
    clear();
    set(t.state);
    if (t.afterMs && t.returnTo) timer.current = window.setTimeout(() => set(t.returnTo!), t.afterMs);
  }, [set]);

  useEffect(() => clear, []);
  return { state, request, get: () => stateRef.current };
}
