export function CatPage() {
  return (
    <section className="w-full max-w-3xl text-center">
      <h1 className="text-3xl font-semibold text-foreground">Cat</h1>
      <p className="mt-3 text-foreground-soft">
        Chat with the cats of Bobo&apos;s book of friends.
      </p>
      <div className="mt-8 rounded-2xl border-2 border-dashed border-input bg-white/60 p-10">
        <p className="text-muted-foreground">The chat room is coming soon.</p>
      </div>
    </section>
  );
}