import { useState } from "react";
import { Moon, PartyPopper, Sparkles } from "lucide-react";
import { usePetState } from "../shared/engine/usePetState";

const LINES = ["Hi! Want to work together?", "You're doing great!", "Water break soon?", "I'll keep you company."];

export default function HeroPet() {
  const { state, request } = usePetState();
  const [line, setLine] = useState(LINES[0]);
  const [n, setN] = useState(0);

  const poke = () => {
    if (state === "sleeping") request("happy");
    else request("jumping");
    setN((v) => (v + 1) % LINES.length);
    setLine(LINES[(n + 1) % LINES.length]);
  };

  return (
    <div className="relative mx-auto w-full max-w-sm select-none" data-state={state}>
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold shadow-soft" role="status">
        {state === "sleeping" ? "zzz…" : line}
      </div>
      <button onClick={poke} aria-label="Pet the PetFlow cat" className="mt-12 block w-full cursor-pointer">
        <svg viewBox="0 0 240 220" className="w-full overflow-visible">
          <ellipse cx="120" cy="206" rx="70" ry="9" fill="#303044" opacity=".12" />
          <g className="pf-body">
            <path className="pf-tail" d="M180 170 C225 160 232 120 208 108" stroke="#E9946A" strokeWidth="16" strokeLinecap="round" fill="none" />
            <path d="M62 78 L70 30 L102 58 Z M178 78 L170 30 L138 58 Z" fill="#F6C38B" stroke="#E9946A" strokeWidth="4" strokeLinejoin="round" />
            <path d="M72 66 L74 44 L90 58 Z M168 66 L166 44 L150 58 Z" fill="#FFDCE5" />
            <rect x="52" y="50" width="136" height="136" rx="62" fill="#F6C38B" />
            <ellipse cx="120" cy="176" rx="38" ry="22" fill="#FFF1DE" />
            <g className="pf-eye"><ellipse cx="94" cy="108" rx="9" ry="12" fill="#303044" /><circle cx="97" cy="104" r="3" fill="#fff" /></g>
            <g className="pf-eye"><ellipse cx="146" cy="108" rx="9" ry="12" fill="#303044" /><circle cx="149" cy="104" r="3" fill="#fff" /></g>
            <ellipse cx="78" cy="132" rx="10" ry="6" fill="#FFB3C6" opacity=".8" />
            <ellipse cx="162" cy="132" rx="10" ry="6" fill="#FFB3C6" opacity=".8" />
            <path d="M112 130 Q120 138 128 130 M120 126 L120 134" stroke="#303044" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <path d="M60 128 L36 122 M60 136 L36 140 M180 128 L204 122 M180 136 L204 140" stroke="#303044" strokeWidth="2.5" strokeLinecap="round" />
            <text className="pf-zzz" x="170" y="40" fontSize="26" fontWeight="700" fill="#8b6bd9" fontFamily="Fredoka">Z</text>
          </g>
        </svg>
      </button>
      <div className="mt-2 flex justify-center gap-2">
        <button className="btn-soft !px-4 !py-2 text-sm" onClick={() => request("dancing")}><PartyPopper size={16} /> Dance</button>
        <button className="btn-soft !px-4 !py-2 text-sm" onClick={() => request(state === "sleeping" ? "happy" : "sleeping")}>
          {state === "sleeping" ? <><Sparkles size={16} /> Wake up</> : <><Moon size={16} /> Sleep</>}
        </button>
      </div>
    </div>
  );
}
