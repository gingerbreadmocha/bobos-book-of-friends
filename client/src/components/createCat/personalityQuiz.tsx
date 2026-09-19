import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "cn";
import { PERSONALITY_QUIZ_SECTIONS } from "./quizQuestions";

export type PersonalityAnswers = Record<string, string>;

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
      {PERSONALITY_QUIZ_SECTIONS.map((section) => (
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
