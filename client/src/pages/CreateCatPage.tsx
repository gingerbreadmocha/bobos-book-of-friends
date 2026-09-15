import { CreateCatTitle } from "../components/createCat/createCatTitle";
import { CreateCatForm } from "../components/createCat/createCatForm";

export function CreateCatPage() {
  return (
    <section className="w-full max-w-3xl text-center m-auto">
      <CreateCatTitle />
      <h1 className="text-3xl font-semibold text-violet-950">Create a cat</h1>
      <div className="mt-8 rounded-2xl border-2 border-dashed border-violet-300 bg-white/60 p-10 text-left">
        <CreateCatForm />
      </div>
    </section>
  );
}
