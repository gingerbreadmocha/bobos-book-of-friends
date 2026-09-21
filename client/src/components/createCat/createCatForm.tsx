import { useEffect, useState, type FormEvent } from "react";
import { AvatarUploader } from "./avatarUploader";
import { PersonalityQuiz, type PersonalityAnswers } from "./personalityQuiz";
import { useCreateCat } from "@/hooks/useCreateCat";

export function CreateCatForm() {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>("createCat/avatars/tuxedo_avatar.png");
  const [description, setDescription] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<PersonalityAnswers>({});
  const { error, createCat } = useCreateCat();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = {
      name,
      avatarUrl: imageUrl,
      description,
      personality: quizAnswers,
      popularity: 0,
    };

    createCat(body);
  };

  useEffect(() => {
    if (error) alert(error);
  }, [error]);

  return (
    <form onSubmit={handleSubmit} className="space-y-10 w-full p-8">
      {/* 1. Name */}
      <section aria-labelledby="cat-name-heading">
        <h2 id="cat-name-heading" className="text-2xl font-semibold text-foreground">
          Name
        </h2>
        <label htmlFor="cat-name">
          <span className="mt-1 block text-foreground-soft">What&apos;s your cat&apos;s name?</span>
          <input
            id="cat-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Bobo"
            className="mt-3 w-full rounded-xl border-2 border-input bg-white/70 px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors duration-150 focus:border-primary focus:ring-2 focus:ring-ring"
          />
        </label>
      </section>

      {/* 2. Avatar */}
      <section aria-labelledby="cat-avatar-heading">
        <h2 id="cat-avatar-heading" className="text-2xl font-semibold text-foreground">
          Avatar
        </h2>
        <p className="mt-1 text-foreground-soft">
          Upload a cute photo of your cat (or choose from our avatars).
        </p>
        <AvatarUploader setImageUrl={setImageUrl} />
      </section>

      {/* 3. Description */}
      <section aria-labelledby="cat-description-heading">
        <h2 id="cat-description-heading" className="text-2xl font-semibold text-foreground">
          Description
        </h2>
        <label htmlFor="cat-description">
          <span className="mt-1 block text-foreground-soft">Tell us a bit about your cat.</span>
          <textarea
            id="cat-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="e.g. Bobo is a fancy Tuxie that likes to scooty poopy on the carpet randomly to troll his butlers..."
            rows={5}
            className="mt-3 w-full resize-none rounded-xl border-2 border-input bg-white/70 px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-colors duration-150 focus:border-primary focus:ring-2 focus:ring-ring"
          />
        </label>
      </section>

      {/* 4. Personality quiz */}
      <section aria-labelledby="cat-quiz-heading">
        <h2 id="cat-quiz-heading" className="text-2xl font-semibold text-foreground">
          Personality quiz
        </h2>
        <PersonalityQuiz answers={quizAnswers} onChange={setQuizAnswers} />
      </section>

      <div>
        <button
          type="submit"
          className="rounded-xl bg-primary-strong px-8 py-3 font-medium text-primary-foreground shadow-md transition-colors duration-150 hover:bg-primary-strong-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-ring active:bg-primary-strong w-full"
        >
          Create cat
        </button>
      </div>
    </form>
  );
}
