export const isTauri = () => typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
/** Calls a Rust command; resolves undefined in the browser. */
export async function invoke<T = void>(cmd: string, args?: Record<string, unknown>): Promise<T | undefined> {
  if (!isTauri()) return undefined;
  const m = await import("@tauri-apps/api/core");
  return m.invoke<T>(cmd, args);
}
