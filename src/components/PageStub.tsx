import { Hammer } from "lucide-react";
export default function PageStub({ title, stage, children }: { title: string; stage: string; children?: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-mint"><Hammer /></span>
      <h1 className="mt-4 text-4xl font-bold">{title}</h1>
      <p className="mt-2 text-ink/70">This page is built in {stage}.</p>
      {children}
    </section>
  );
}
