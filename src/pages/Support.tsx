import { Coffee, Github, QrCode } from "lucide-react";
export default function Support() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 text-center">
      <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-blush"><Coffee size={40} /></span>
      <h1 className="mt-5 text-4xl font-bold">Enjoying PetFlow? Buy Me a Coffee!</h1>
      <p className="mx-auto mt-3 max-w-prose">PetFlow is free to use, with no ads, accounts, or subscriptions. If it brightened your day, a coffee for Y Pengly is a lovely thank-you. Donating is completely voluntary.</p>
      <div className="mx-auto mt-8 grid w-56 place-items-center rounded-3xl border-2 border-dashed border-ink/30 p-8">
        <QrCode size={96} className="opacity-40" /><p className="mt-2 text-sm">Donation QR placeholder</p>
      </div>
      <p className="mt-6 text-sm text-ink/70">Payment link and social links will be added by the developer.</p>
      <p className="mt-4 inline-flex items-center gap-2 text-sm"><Github size={16} /> GitHub link: coming soon</p>
    </section>
  );
}
