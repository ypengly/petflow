import { useState, type ReactNode } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, PawPrint, X } from "lucide-react";
import ActivePet from "./ActivePet";

const NAV = [
  { to: "/", label: "Home" }, { to: "/pets", label: "Pets" },
  { to: "/playground", label: "Playground" }, { to: "/desktop", label: "Desktop app" },
  { to: "/settings", label: "Settings" }, { to: "/support", label: "Support" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const link = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-2 font-display font-medium transition-colors ${isActive ? "bg-ink text-cream" : "hover:bg-lavender"}`;
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link to="/" className="flex items-center gap-2 font-display text-2xl font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-blush"><PawPrint size={20} /></span> PetFlow
          </Link>
          <nav className="hidden gap-1 md:flex" aria-label="Main">
            {NAV.map((n) => <NavLink key={n.to} to={n.to} end={n.to === "/"} className={link}>{n.label}</NavLink>)}
          </nav>
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open && (
          <nav className="flex flex-col gap-1 px-5 pb-4 md:hidden" aria-label="Mobile">
            {NAV.map((n) => <NavLink key={n.to} to={n.to} end={n.to === "/"} className={link} onClick={() => setOpen(false)}>{n.label}</NavLink>)}
          </nav>
        )}
      </header>
      <main className="flex-1">{children}</main>
      <ActivePet />
      <footer className="mt-20 bg-lavender/60">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-xl font-bold">PetFlow</p>
            <p className="text-sm">A Little Friend While You Work.</p>
          </div>
          <ul className="text-sm leading-7">
            {NAV.map((n) => <li key={n.to}><Link className="hover:underline" to={n.to}>{n.label}</Link></li>)}
          </ul>
          <p className="text-sm">Made by Y Pengly. No accounts, no tracking: your settings stay on your device.</p>
        </div>
      </footer>
    </div>
  );
}
