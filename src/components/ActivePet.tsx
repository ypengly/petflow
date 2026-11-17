import { useRef } from "react";
import PetStage from "./PetStage";
import { getPet } from "../shared/pets/registry";
import { updateSettings, useSettings } from "../shared/store";
/** Web-mode "activated" pet: floats above every page until hidden. */
export default function ActivePet() {
  const s = useSettings(); const ref = useRef<HTMLDivElement>(null);
  const def = s.active ? getPet(s.active) : undefined;
  if (!def || s.overlayOn) return null;
  return (
    <div ref={ref} className="pointer-events-none fixed inset-0 z-40">
      <PetStage key={def.id} def={def} size={140 * s.size} speed={s.speed} autonomy={s.autonomy} constraints={ref} onHide={() => updateSettings({ active: null })} />
    </div>
  );
}
