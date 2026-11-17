import type { AnimationState, PetDefinition } from "../shared/types";
type Ears = "pointy" | "floppy" | "long" | "round" | "bumps" | "none";
const EARS: Record<string, Ears> = { cat: "pointy", fox: "pointy", dog: "floppy", rabbit: "long", panda: "round", hamster: "round", frog: "bumps" };
const BEAK = ["penguin", "chick"];
const SPIKES = ["dinosaur", "dragon"];

export default function PetSprite({ def, state = "idle", size = 200, speed = 1, umbrella = false }: { def: PetDefinition; state?: AnimationState; size?: number; speed?: number; umbrella?: boolean }) {
  const { body, accent } = def.palette; const ears = EARS[def.id] ?? "none";
  const dark = def.id === "penguin" ? "#fff" : "#303044";
  return (
    <svg viewBox="0 0 240 220" width={size} height={size * 0.92} data-state={state} style={{ ["--spd" as string]: speed, overflow: "visible" }} role="img" aria-label={`${def.name}, ${state}`}>
      <ellipse cx="120" cy="206" rx="70" ry="9" fill="#303044" opacity=".12" />
      <g className="pf-body">
        <path className="pf-tail" d="M180 170 C225 160 232 120 208 108" stroke={accent} strokeWidth="16" strokeLinecap="round" fill="none" />
        {SPIKES.includes(def.id) && <path d="M92 52 L104 30 L116 50 L128 28 L140 52 Z" fill={accent} />}
        {ears === "pointy" && <path d="M62 78 L70 30 L102 58 Z M178 78 L170 30 L138 58 Z" fill={body} stroke={accent} strokeWidth="4" strokeLinejoin="round" />}
        {ears === "floppy" && <><ellipse cx="62" cy="86" rx="20" ry="38" fill={accent} transform="rotate(14 62 86)" /><ellipse cx="178" cy="86" rx="20" ry="38" fill={accent} transform="rotate(-14 178 86)" /></>}
        {ears === "long" && <><ellipse cx="92" cy="30" rx="15" ry="42" fill={body} stroke={accent} strokeWidth="3" /><ellipse cx="148" cy="30" rx="15" ry="42" fill={body} stroke={accent} strokeWidth="3" /><ellipse cx="92" cy="32" rx="7" ry="28" fill={accent} /><ellipse cx="148" cy="32" rx="7" ry="28" fill={accent} /></>}
        {ears === "round" && <><circle cx="70" cy="62" r="22" fill={accent} /><circle cx="170" cy="62" r="22" fill={accent} /></>}
        {ears === "bumps" && <><circle cx="86" cy="56" r="22" fill={body} stroke={accent} strokeWidth="4" /><circle cx="154" cy="56" r="22" fill={body} stroke={accent} strokeWidth="4" /></>}
        <rect x="52" y="50" width="136" height="136" rx="62" fill={body} stroke={def.id === "panda" ? "#E5E5EE" : "none"} strokeWidth="3" />
        <ellipse cx="120" cy="176" rx="38" ry="22" fill="#fff" opacity=".55" />
        {def.id === "panda" && <><ellipse cx="94" cy="108" rx="18" ry="22" fill={accent} /><ellipse cx="146" cy="108" rx="18" ry="22" fill={accent} /></>}
        <g className="pf-eye"><ellipse cx="94" cy="108" rx="9" ry="12" fill={def.id === "panda" ? "#fff" : dark} /><circle cx="97" cy="104" r="3" fill={def.id === "panda" ? "#303044" : "#fff"} /></g>
        <g className="pf-eye"><ellipse cx="146" cy="108" rx="9" ry="12" fill={def.id === "panda" ? "#fff" : dark} /><circle cx="149" cy="104" r="3" fill={def.id === "panda" ? "#303044" : "#fff"} /></g>
        <ellipse cx="78" cy="136" rx="10" ry="6" fill="#FF8FAE" opacity=".6" /><ellipse cx="162" cy="136" rx="10" ry="6" fill="#FF8FAE" opacity=".6" />
        {BEAK.includes(def.id) ? <path d="M108 128 L132 128 L120 144 Z" fill={accent} /> : <path d="M112 130 Q120 138 128 130" stroke="#303044" strokeWidth="3.5" fill="none" strokeLinecap="round" />}
        {state === "eating" && <circle cx="120" cy="150" r="9" fill="#F59A5B" stroke="#fff" strokeWidth="2" />}
        {umbrella && <g><path d="M60 24 Q120 -40 180 24 Z" fill="#7aa7ff" /><path d="M120 -2 L120 52" stroke="#303044" strokeWidth="4" /></g>}
        <text className="pf-zzz" x="170" y="40" fontSize="26" fontWeight="700" fill="#8b6bd9" fontFamily="Fredoka">Z</text>
      </g>
    </svg>
  );
}
