import { useCallback, useEffect, useRef, useState } from "react";
/** Timestamp-based countdown: stays accurate when the tab is throttled. */
export function useCountdown(onDone: () => void) {
  const [total, setTotal] = useState(0);
  const [left, setLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const endAt = useRef(0);
  const done = useRef(onDone); done.current = onDone;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const r = Math.max(0, endAt.current - Date.now());
      setLeft(r);
      if (r === 0) { setRunning(false); done.current(); }
    }, 250);
    return () => window.clearInterval(id);
  }, [running]);

  const start = useCallback((sec: number) => { setTotal(sec * 1000); setLeft(sec * 1000); endAt.current = Date.now() + sec * 1000; setRunning(true); }, []);
  const pause = useCallback(() => { setLeft(Math.max(0, endAt.current - Date.now())); setRunning(false); }, []);
  const resume = useCallback(() => { endAt.current = Date.now() + left; setRunning(true); }, [left]);
  const reset = useCallback(() => { setRunning(false); setLeft(0); setTotal(0); }, []);
  return { total, left, running, start, pause, resume, reset, active: total > 0 };
}
