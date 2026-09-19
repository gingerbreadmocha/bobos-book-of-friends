import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { AvatarUploader } from "./avatarUploader";
import { PersonalityQuiz, type PersonalityAnswers } from "./personalityQuiz";
import { PERSONALITY_QUIZ_QUESTIONS } from "./quizQuestions";
import { useCreateCat } from "@/hooks/useCreateCat";

const NAME_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 1000;
const DEFAULT_AVATAR_URL = "createCat/avatars/tuxedo_avatar.png";

type CreateCatFormValues = {
  name: string;
  avatarUrl: string | null;
  description: string;
  personality: PersonalityAnswers;
};

const INPUT_CLASSES =
  "mt-3 w-full rounded-xl border-2 border-violet-300 bg-white/70 px-4 py-3 text-violet-950 placeholder-violet-300 outline-none transition-colors duration-150 focus:border-violet-500 focus:ring-2 focus:ring-violet-300";

export function CreateCatForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const { createCat } = useCreateCat();

  const defaultValues: CreateCatFormValues = {
    name: "",
    avatarUrl: DEFAULT_AVATAR_URL,
    description: "",
    personality: {},
  };

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        await createCat({
          name: value.name.trim(),
          avatarUrl: value.avatarUrl,
          description: value.description.trim(),
          personality: value.personality,
        });
      } catch (submitError) {
        setServerError(
          submitError instanceof Error
            ? submitError.message
            : "Something went wrong. Please try again.",
        );
      }
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-10 w-full p-8"
    >
      {/* 1. Name */}
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => {
            if (!value.trim()) return "Name is required.";
            if (value.length > NAME_MAX_LENGTH) {
              return `Name must be ${NAME_MAX_LENGTH} characters or fewer.`;
            }
            return undefined;
          },
        }}
      >
        {(field) => (
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
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="e.g. Bobo"
                maxLength={NAME_MAX_LENGTH}
                aria-invalid={field.state.meta.errors.length > 0}
                className={INPUT_CLASSES}
              />
            </label>
            {field.state.meta.errors.length > 0 && (
              <span
                role="alert"
                className="mt-1 block text-xs font-normal text-destructive"
              >
                {field.state.meta.errors[0]}
              </span>
            )}
          </section>
        )}
      </form.Field>

      {/* 2. Avatar */}
      <form.Field name="avatarUrl">
        {(field) => (
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
            <AvatarUploader
              setImageUrl={(updater) => field.handleChange(updater)}
            />
          </section>
        )}
      </form.Field>

      {/* 3. Description */}
      <form.Field
        name="description"
        validators={{
          onChange: ({ value }) =>
            value.length > DESCRIPTION_MAX_LENGTH
              ? `Please keep your cat's description to ${DESCRIPTION_MAX_LENGTH} characters or fewer.`
              : undefined,
        }}
      >
        {(field) => (
          <section aria-labelledby="cat-description-heading">
            <h2
              id="cat-description-heading"
              className="text-2xl font-semibold text-violet-950"
            >
              Description
            </h2>
            <label htmlFor="cat-description">
              <span className="mt-1 block text-violet-900">
                Tell us a bit about your cat.
              </span>
              <textarea
                id="cat-description"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="e.g. Bobo is a fancy Tuxie that likes to scooty poopy on the carpet randomly to troll his butlers..."
                rows={5}
                maxLength={DESCRIPTION_MAX_LENGTH}
                aria-invalid={field.state.meta.errors.length > 0}
                className={`${INPUT_CLASSES} resize-none`}
              />
            </label>
            {field.state.meta.errors.length > 0 && (
              <span
                role="alert"
                className="mt-1 block text-xs font-normal text-destructive"
              >
                {field.state.meta.errors[0]}
              </span>
            )}
          </section>
        )}
      </form.Field>

      {/* 4. Personality quiz */}
      <form.Field
        name="personality"
        validators={{
          onChange: ({ value }) => {
            const missing = PERSONALITY_QUIZ_QUESTIONS.find(
              (question) => !value[question.id]?.trim(),
            );
            return missing
              ? `Please answer every quiz question (${missing.prompt}).`
              : undefined;
          },
        }}
      >
        {(field) => (
          <section aria-labelledby="cat-quiz-heading">
            <h2
              id="cat-quiz-heading"
              className="text-2xl font-semibold text-violet-950"
            >
              Personality quiz
            </h2>
            <PersonalityQuiz
              answers={field.state.value}
              onChange={(next) => field.handleChange(next)}
            />
            {field.state.meta.errors.length > 0 && (
              <span
                role="alert"
                className="mt-3 block text-sm font-normal text-destructive"
              >
                {field.state.meta.errors[0]}
              </span>
            )}
          </section>
        )}
      </form.Field>

      <div className="space-y-3">
        {serverError && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {serverError}
          </p>
        )}

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="rounded-xl bg-violet-950 px-8 py-3 font-medium text-white shadow-md transition-colors duration-150 hover:bg-violet-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 active:bg-violet-950 disabled:cursor-not-allowed disabled:opacity-60 w-full"
            >
              {isSubmitting ? "Creating cat…" : "Create cat"}
            </button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}
