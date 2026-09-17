import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "cn";

export type PersonalityAnswers = Record<string, string>;

type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
};

type QuizSection = {
  id: "personality" | "behavior" | "flavor";
  title: string;
  questions: QuizQuestion[];
};

const QUIZ_SECTIONS: QuizSection[] = [
  {
    id: "personality",
    title: "Core personality",
    questions: [
      {
        id: "energy",
        prompt: "How would you describe their energy?",
        options: ["Chill & relaxed", "Balanced", "Energetic & playful"],
      },
      {
        id: "affection",
        prompt: "How affectionate are they?",
        options: [
          "Always wants cuddles",
          "Affectionate on their terms",
          "Pretty independent",
          "I am their servant",
        ],
      },
      {
        id: "vocal",
        prompt: "How vocal are they?",
        options: [
          "Almost silent",
          "Occasional meows",
          "Pretty chatty",
          "Has an opinion about EVERYTHING",
        ],
      },
      {
        id: "strangers",
        prompt: "How do they react to strangers?",
        options: [
          "Hides immediately",
          "Watches from a safe distance",
          "Slowly warms up",
          "Immediately says hello",
        ],
      },
      {
        id: "cats",
        prompt: "How do they feel about other cats?",
        options: [
          "Prefers being alone",
          "Doesn't really care",
          "Likes having a friend",
          "Loves everyone",
        ],
      },
    ],
  },
  {
    id: "behavior",
    title: "Behavior",
    questions: [
      {
        id: "favoriteActivity",
        prompt: "What's their favorite activity?",
        options: [
          "Sleeping",
          "Playing",
          "Eating",
          "Watching the world",
          "Getting attention",
        ],
      },
      {
        id: "whenWantingSomething",
        prompt: "What do they do when they want something?",

        options: [
          "Stare at me",
          "Meow",
          "Follow me around",
          "Demand it loudly",
          "Find a way to get it themselves",
        ],
      },
    ],
  },
  {
    id: "flavor",
    title: "Personality flavor",
    questions: [
      {
        id: "vibe",
        prompt: "Which best describes your cat?",
        options: [
          "Sweet & gentle",
          "Sassy & opinionated",
          "Silly & Chaotic",
          "Confident & bossy",
          "Shy & sensitive",
        ],
      },
    ],
  },
];

const OPTION_GRID_COLUMNS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
};

function optionGridClassName(optionCount: number) {
  // Up to 3 options fit on a single row; more than 3 wrap into 2 columns.
  return optionCount <= 3
    ? OPTION_GRID_COLUMNS[Math.max(optionCount, 1)]
    : "grid-cols-2";
}

type PersonalityQuizProps = {
  answers: PersonalityAnswers;
  onChange: (answers: PersonalityAnswers) => void;
};

export function PersonalityQuiz({ answers, onChange }: PersonalityQuizProps) {
  const selectOption = (questionId: string, option: string) => {
    onChange({ ...answers, [questionId]: option });
  };

  return (
    <div className="mt-4 space-y-8">
      <p className="text-violet-900">
        Pick the answer that fits your cat best &mdash; there are no wrong
        answers!
      </p>
      {QUIZ_SECTIONS.map((section) => (
        <section
          key={section.id}
          aria-labelledby={`quiz-${section.id}-heading`}
        >
          <h3
            id={`quiz-${section.id}-heading`}
            className="text-lg font-semibold text-violet-950"
          >
            {section.title}
          </h3>

          <div className="mt-3 space-y-6">
            {section.questions.map((question) => (
              <fieldset key={question.id}>
                <legend className="font-medium text-violet-900">
                  {question.prompt}
                </legend>
                <RadioGroup
                  name={question.id}
                  value={answers[question.id]}
                  onValueChange={(value) => selectOption(question.id, value)}
                  className={cn("mt-2", optionGridClassName(question.options.length))}
                >
                  {question.options.map((option) => {
                    const isSelected = answers[question.id] === option;
                    return (
                      <label
                        key={option}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-colors duration-150",
                          isSelected
                            ? "border-violet-600 bg-violet-100 text-violet-950"
                            : "border-violet-300 bg-white/70 text-violet-900 hover:border-violet-400 hover:bg-violet-50",
                        )}
                      >
                        <RadioGroupItem value={option} className="sr-only!" />
                        <span>{option}</span>
                      </label>
                    );
                  })}
                </RadioGroup>
              </fieldset>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
