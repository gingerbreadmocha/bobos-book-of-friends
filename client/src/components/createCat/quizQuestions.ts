export type PersonalityQuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
};

export type PersonalityQuizSection = {
  id: "personality" | "behavior" | "flavor";
  title: string;
  questions: PersonalityQuizQuestion[];
};

export const PERSONALITY_QUIZ_SECTIONS: PersonalityQuizSection[] = [
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

/** Every quiz question in order, used by the create-cat form validation. */
export const PERSONALITY_QUIZ_QUESTIONS: PersonalityQuizQuestion[] =
  PERSONALITY_QUIZ_SECTIONS.flatMap((section) => section.questions);
