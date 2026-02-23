export function HintsWidget({ hints }: { hints: string[] }) {
  if (hints.length === 0) return null;
  return (
    <section className="space-y-2">
      {hints.map((hint, i) => (
        <div key={i} className="flex gap-3 rounded-xl bg-accent/10 border border-accent/20 px-4 py-3 items-start">
          <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
          <p className="text-xs text-foreground/90 leading-relaxed">{hint}</p>
        </div>
      ))}
    </section>
  );
}
