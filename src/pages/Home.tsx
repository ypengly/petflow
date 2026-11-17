import { Link } from "react-router-dom";
import { Clock, CloudSun, Hourglass, MousePointerClick, PawPrint, Download, Layers } from "lucide-react";
import HeroPet from "../components/HeroPet";
import { PETS } from "../shared/pets/registry";

const STEPS = [
  { t: "Pick a friend", d: "Browse twelve pets and preview how each one moves." },
  { t: "Activate it", d: "Let it wander your screen while you work or study." },
  { t: "Click to interact", d: "Dance, nap, check the weather, or start a timer." },
];
const FEATURES = [
  { i: PawPrint, t: "Pets with personality", d: "A cat naps. A dog jumps. Each one behaves its own way." },
  { i: Clock, t: "Clock and calendar", d: "Time and date next to your pet, 12 or 24 hour." },
  { i: CloudSun, t: "Real weather", d: "Live Open-Meteo data, shown only when you ask for it." },
  { i: Hourglass, t: "Focus timer", d: "Countdowns and Pomodoro with your pet working beside you." },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-20">
        <div>
          <h1 className="text-5xl font-bold leading-tight sm:text-6xl">Your Little Friend While You Work.</h1>
          <p className="mt-5 max-w-md text-lg text-ink/80">PetFlow puts a tiny animated companion on your screen. It wanders, naps, and cheers you on while you get things done.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/pets" className="btn-primary"><PawPrint size={18} /> Explore pets</Link>
            <Link to="/desktop" className="btn-soft"><Download size={18} /> Download desktop app</Link>
          </div>
        </div>
        <div className="rounded-[2.5rem] bg-blush/60 p-8"><HeroPet /></div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <h2 className="text-3xl font-bold">Meet the collection</h2>
        <ul className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {PETS.map((p) => (
            <li key={p.id}>
              <Link to="/pets" className="block rounded-3xl p-4 text-center shadow-soft transition-transform hover:-translate-y-1" style={{ background: p.palette.body }}>
                <span className="mx-auto mb-2 block h-12 w-12 rounded-full" style={{ background: p.palette.accent }} />
                <span className="font-display font-semibold text-ink">{p.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <h2 className="text-3xl font-bold">How it works</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.t} className="rounded-3xl bg-mint p-6">
              <span className="font-display text-2xl font-bold">{i + 1}.</span>
              <h3 className="text-xl font-semibold">{s.t}</h3>
              <p className="mt-1 text-ink/80">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-6">
        <h2 className="text-3xl font-bold">Small tools, close by</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {FEATURES.map(({ i: Icon, t, d }) => (
            <div key={t} className="flex gap-4 rounded-3xl bg-white p-5 shadow-soft">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-lavender"><Icon /></span>
              <div><h3 className="text-lg font-semibold">{t}</h3><p className="text-ink/80">{d}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-5">
        <div className="grid items-center gap-6 rounded-[2.5rem] bg-lavender p-8 md:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-2 text-3xl font-bold"><Layers /> On your desktop</h2>
            <p className="mt-3">In the Windows app your pet floats above other windows with a transparent background and follows you across monitors. The app is in development and has no installer yet.</p>
            <Link to="/desktop" className="btn-primary mt-5">See desktop status</Link>
          </div>
          <div className="rounded-3xl bg-white/70 p-6 text-sm"><MousePointerClick className="mb-2" />Preview screenshots will appear here once the overlay is built (Stage 6).</div>
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-5 text-center">
        <h2 className="text-3xl font-bold">Support the developer</h2>
        <p className="mx-auto mt-2 max-w-md">PetFlow is free. If you like it, you can buy Y Pengly a coffee, but never have to.</p>
        <Link to="/support" className="btn-soft mt-4">Buy me a coffee</Link>
      </section>
    </>
  );
}
