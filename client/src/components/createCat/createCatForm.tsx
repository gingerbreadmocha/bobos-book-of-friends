import { useState, type FormEvent } from "react";
import { AvatarUploader } from "./avatarUploader";
import { PersonalityQuiz, type PersonalityAnswers } from "./personalityQuiz";

export function CreateCatForm() {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>("");
  const [quizAnswers, setQuizAnswers] = useState<PersonalityAnswers>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = {
      name,
      avatarUrl: imageUrl,
      ownerId: "1",
      personality: quizAnswers,
      popularity: 0,
    };

    console.log("body ", body);
    // TODO: Submit the new cat profile (name + selected avatar, if any + quiz
    // answers) once the API endpoint is ready. To store the chosen avatar here,
    // pass a setter to AvatarUploader's setImageUrl prop
    // (it reports `SelectedAvatar | null`).
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 w-full p-8">
      {/* 1. Name */}
      <section aria-labelledby="cat-name-heading">
        <h2
          id="cat-name-heading"
          className="text-2xl font-semibold text-violet-950"
        >
          Name
        </h2>
        <label htmlFor="cat-name">
          <span className="mt-1 block text-violet-900">
            What&apos;s your cat&apos;s name?
          </span>
          <input
            id="cat-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Bobo"
            className="mt-3 w-full rounded-xl border-2 border-violet-300 bg-white/70 px-4 py-3 text-violet-950 placeholder-violet-300 outline-none transition-colors duration-150 focus:border-violet-500 focus:ring-2 focus:ring-violet-300"
          />
        </label>
      </section>

      {/* 2. Avatar */}
      <section aria-labelledby="cat-avatar-heading">
        <h2
          id="cat-avatar-heading"
          className="text-2xl font-semibold text-violet-950"
        >
          Avatar
        </h2>
        <p className="mt-1 text-violet-900">
          Upload a cute photo of your cat (or choose from our avatars).
        </p>
        <AvatarUploader setImageUrl={setImageUrl} />
      </section>

      {/* 3. Personality quiz */}
      <section aria-labelledby="cat-quiz-heading">
        <h2
          id="cat-quiz-heading"
          className="text-2xl font-semibold text-violet-950"
        >
          Personality quiz
        </h2>
        <PersonalityQuiz answers={quizAnswers} onChange={setQuizAnswers} />
      </section>

      <div>
        <button
          type="submit"
          className="rounded-xl bg-violet-950 px-8 py-3 font-medium text-white shadow-md transition-colors duration-150 hover:bg-violet-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 active:bg-violet-950 w-full"
        >
          Create cat
        </button>
      </div>
    </form>
  );
}
