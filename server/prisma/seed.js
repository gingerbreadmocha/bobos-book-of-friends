import "dotenv/config";

import bcrypt from "bcryptjs";
import pg from "pg";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const BCRYPT_ROUNDS = 10;

// Every seeded account uses the same demo password so logging in locally is
// easy. It matches the minimum length required by POST /api/create-account.
const DEMO_PASSWORD = "guestbook123";

/*
 * Seed data
 * ---------
 * Run with `prisma db seed` (or `npm run db:seed`). The script is idempotent:
 * existing users, cats, and guestbook entries are left untouched, so it can be
 * re-run safely. The one exception: cats that are missing a `description` get
 * one backfilled from this file, so new copy reaches already-seeded databases
 * without clobbering descriptions users may have written themselves.
 */

/** Accounts to create. Identified by email (the unique column). */
const USERS = [
  { username: "bobo", email: "bobo@example.com" },
  { username: "jenny", email: "jenny@example.com" },
  { username: "mocha", email: "mocha@example.com" },
];

/**
 * Cats to create. `owner` references a user's email from USERS. `description`
 * is a short (1-3 sentence) blurb shown on the cat's profile. `personality`
 * uses the shape produced by the client's personality quiz
 * (client/src/components/createCat/personalityQuiz.tsx). `popularity` starts
 * at the number of guestbook entries that add this cat below.
 */
const CATS = [
  {
    name: "Bobo",
    description:
      "A sweet and gentle cat who slowly warms up to new people but loves attention from friends. Bobo is pretty chatty and will follow you around when they want something.",
    owner: "mocha@example.com",
    personality: {
      energy: "Balanced",
      affection: "Affectionate on their terms",
      vocal: "Pretty chatty",
      strangers: "Slowly warms up",
      cats: "Likes having a friend",
      favoriteActivity: "Getting attention",
      whenWantingSomething: "Follow me around",
      vibe: "Sweet & gentle",
    },
    popularity: 2,
  },
  {
    name: "Mochi",
    description:
      "A silly, chaotic ball of energy who says hello to every new face. Mochi always wants cuddles, loves everyone, and is endlessly up for a game.",
    owner: "bobo@example.com",
    personality: {
      energy: "Energetic & playful",
      affection: "Always wants cuddles",
      vocal: "Pretty chatty",
      strangers: "Immediately says hello",
      cats: "Loves everyone",
      favoriteActivity: "Playing",
      whenWantingSomething: "Meow",
      vibe: "Silly & Chaotic",
    },
    popularity: 1,
  },

  // --- Additional seeded cats: batch 3 of 3 ---
  {
    name: "Miso",
    description:
      "Sassy and opinionated, Miso has thoughts about everything and isn't afraid to share them. They're chatty and affectionate on their own terms — and always ready to meow about mealtime.",
    owner: "mocha@example.com",
    personality: {
      energy: "Balanced",
      affection: "Affectionate on their terms",
      vocal: "Pretty chatty",
      strangers: "Watches from a safe distance",
      cats: "Likes having a friend",
      favoriteActivity: "Eating",
      whenWantingSomething: "Meow",
      vibe: "Sassy & opinionated",
    },
    popularity: 1,
  },
  {
    name: "Nugget",
    description:
      "A playful, high-energy cat who greets everyone they meet. Nugget loves cuddles, adores other cats, and can always be convinced to play.",
    owner: "bobo@example.com",
    personality: {
      energy: "Energetic & playful",
      affection: "Always wants cuddles",
      vocal: "Pretty chatty",
      strangers: "Immediately says hello",
      cats: "Loves everyone",
      favoriteActivity: "Playing",
      whenWantingSomething: "Meow",
      vibe: "Silly & Chaotic",
    },
    popularity: 2,
  },
  {
    name: "Panko",
    description:
      "A shy, sensitive soul who prefers quiet corners and long naps. Panko is almost silent and hides from strangers, but their gentle presence is worth the wait.",
    owner: "jenny@example.com",
    personality: {
      energy: "Chill & relaxed",
      affection: "Affectionate on their terms",
      vocal: "Almost silent",
      strangers: "Hides immediately",
      cats: "Prefers being alone",
      favoriteActivity: "Sleeping",
      whenWantingSomething: "Stare at me",
      vibe: "Shy & sensitive",
    },
    popularity: 0,
  },
  {
    name: "Fig",
    description:
      "A quiet observer who would rather watch the world go by than join the action. Fig is independent and shy, warming up slowly to the few people they trust.",
    owner: "mocha@example.com",
    personality: {
      energy: "Balanced",
      affection: "Pretty independent",
      vocal: "Occasional meows",
      strangers: "Slowly warms up",
      cats: "Doesn't really care",
      favoriteActivity: "Watching the world",
      whenWantingSomething: "Stare at me",
      vibe: "Shy & sensitive",
    },
    popularity: 0,
  },
  {
    name: "Onyx",
    description:
      "Confident, calm, and clearly in charge. Onyx is almost silent and fiercely independent, and will find their own way to whatever they want — usually a snack.",
    owner: "bobo@example.com",
    personality: {
      energy: "Chill & relaxed",
      affection: "I am their servant",
      vocal: "Almost silent",
      strangers: "Watches from a safe distance",
      cats: "Doesn't really care",
      favoriteActivity: "Eating",
      whenWantingSomething: "Find a way to get it themselves",
      vibe: "Confident & bossy",
    },
    popularity: 0,
  },
  {
    name: "Zelda",
    description:
      "Zelda has an opinion about everything and demands it loudly. Energetic and playful, they're convinced you exist to serve them.",
    owner: "jenny@example.com",
    personality: {
      energy: "Energetic & playful",
      affection: "I am their servant",
      vocal: "Has an opinion about EVERYTHING",
      strangers: "Watches from a safe distance",
      cats: "Doesn't really care",
      favoriteActivity: "Playing",
      whenWantingSomething: "Demand it loudly",
      vibe: "Sassy & opinionated",
    },
    popularity: 1,
  },
  {
    name: "Clover",
    description:
      "Sweet and gentle, Clover loves being the center of attention. They warm up slowly, but once they trust you, they'll follow you everywhere for cuddles.",
    owner: "mocha@example.com",
    personality: {
      energy: "Balanced",
      affection: "Always wants cuddles",
      vocal: "Occasional meows",
      strangers: "Slowly warms up",
      cats: "Likes having a friend",
      favoriteActivity: "Getting attention",
      whenWantingSomething: "Follow me around",
      vibe: "Sweet & gentle",
    },
    popularity: 1,
  },
  {
    name: "Roux",
    description:
      "A chatty, playful cat who greets every visitor like an old friend. Roux is silly and affectionate on their terms, and always up for a snack or a game.",
    owner: "bobo@example.com",
    personality: {
      energy: "Energetic & playful",
      affection: "Affectionate on their terms",
      vocal: "Pretty chatty",
      strangers: "Immediately says hello",
      cats: "Likes having a friend",
      favoriteActivity: "Eating",
      whenWantingSomething: "Meow",
      vibe: "Silly & Chaotic",
    },
    popularity: 2,
  },
  {
    name: "Juniper",
    description:
      "Quiet and independent, Juniper would rather nap in a sunbeam than mingle. They hide from strangers and almost never meow, but their calm presence is cozy.",
    owner: "jenny@example.com",
    personality: {
      energy: "Chill & relaxed",
      affection: "Pretty independent",
      vocal: "Almost silent",
      strangers: "Hides immediately",
      cats: "Prefers being alone",
      favoriteActivity: "Sleeping",
      whenWantingSomething: "Stare at me",
      vibe: "Shy & sensitive",
    },
    popularity: 0,
  },
  {
    name: "Uma",
    description:
      "Uma is a sweet, chatty cat who loves everyone immediately — including you. They crave cuddles and attention and will follow you around hoping for more.",
    owner: "mocha@example.com",
    personality: {
      energy: "Balanced",
      affection: "Always wants cuddles",
      vocal: "Pretty chatty",
      strangers: "Immediately says hello",
      cats: "Loves everyone",
      favoriteActivity: "Getting attention",
      whenWantingSomething: "Follow me around",
      vibe: "Sweet & gentle",
    },
    popularity: 1,
  },
  {
    name: "Toast",
    description:
      "Toast is a shy, sensitive cat who values alone time above all. Almost silent and quick to hide, they prefer staring from a cozy nook.",
    owner: "jenny@example.com",
    personality: {
      energy: "Chill & relaxed",
      affection: "Pretty independent",
      vocal: "Almost silent",
      strangers: "Hides immediately",
      cats: "Prefers being alone",
      favoriteActivity: "Sleeping",
      whenWantingSomething: "Stare at me",
      vibe: "Shy & sensitive",
    },
    popularity: 0,
  },

  // --- Additional seeded cats: batch 2 of 3 ---
  {
    name: "Sage",
    description:
      "Sweet and gentle, Sage takes their time getting to know people. They would rather watch the world from a windowsill, warming up slowly to trusted friends.",
    owner: "jenny@example.com",
    personality: {
      energy: "Balanced",
      affection: "Affectionate on their terms",
      vocal: "Occasional meows",
      strangers: "Slowly warms up",
      cats: "Likes having a friend",
      favoriteActivity: "Watching the world",
      whenWantingSomething: "Stare at me",
      vibe: "Sweet & gentle",
    },
    popularity: 0,
  },
  {
    name: "Basil",
    description:
      "Quiet and independent, Basil observes the world from a safe distance. Almost silent and self-sufficient, they would take a nap over small talk any day.",
    owner: "mocha@example.com",
    personality: {
      energy: "Chill & relaxed",
      affection: "Pretty independent",
      vocal: "Almost silent",
      strangers: "Watches from a safe distance",
      cats: "Doesn't really care",
      favoriteActivity: "Sleeping",
      whenWantingSomething: "Find a way to get it themselves",
      vibe: "Shy & sensitive",
    },
    popularity: 0,
  },
  {
    name: "Kiwi",
    description:
      "Kiwi is a silly, chaotic firecracker who greets everyone with a meow and a head bump. Always wanting cuddles and always ready to play, they love every cat they meet.",
    owner: "bobo@example.com",
    personality: {
      energy: "Energetic & playful",
      affection: "Always wants cuddles",
      vocal: "Pretty chatty",
      strangers: "Immediately says hello",
      cats: "Loves everyone",
      favoriteActivity: "Playing",
      whenWantingSomething: "Meow",
      vibe: "Silly & Chaotic",
    },
    popularity: 2,
  },
  {
    name: "Honey",
    description:
      "Honey lives up to their name — sweet as can be and always ready for cuddles. They warm up slowly to new faces, but once you're a friend, you're showered with attention.",
    owner: "jenny@example.com",
    personality: {
      energy: "Balanced",
      affection: "Always wants cuddles",
      vocal: "Occasional meows",
      strangers: "Slowly warms up",
      cats: "Likes having a friend",
      favoriteActivity: "Getting attention",
      whenWantingSomething: "Follow me around",
      vibe: "Sweet & gentle",
    },
    popularity: 1,
  },
  {
    name: "Maple",
    description:
      "Maple is a relaxed, gentle cat who prefers solitude and sunny nap spots. Shy with strangers and almost silent, they show affection quietly and on their own schedule.",
    owner: "mocha@example.com",
    personality: {
      energy: "Chill & relaxed",
      affection: "Affectionate on their terms",
      vocal: "Almost silent",
      strangers: "Hides immediately",
      cats: "Prefers being alone",
      favoriteActivity: "Sleeping",
      whenWantingSomething: "Stare at me",
      vibe: "Shy & sensitive",
    },
    popularity: 0,
  },
  {
    name: "Dumpling",
    description:
      "Dumpling is a confident, chatty cat who greets everyone like family. Playful and food-motivated, they're not shy about demanding a snack — loudly.",
    owner: "bobo@example.com",
    personality: {
      energy: "Energetic & playful",
      affection: "Affectionate on their terms",
      vocal: "Pretty chatty",
      strangers: "Immediately says hello",
      cats: "Loves everyone",
      favoriteActivity: "Eating",
      whenWantingSomething: "Demand it loudly",
      vibe: "Confident & bossy",
    },
    popularity: 1,
  },
  {
    name: "Sesame",
    description:
      "Independent and quietly opinionated, Sesame is happiest watching the world from a perch. Almost silent and self-reliant, they'll stare at you until you figure out what they want.",
    owner: "jenny@example.com",
    personality: {
      energy: "Balanced",
      affection: "Pretty independent",
      vocal: "Almost silent",
      strangers: "Watches from a safe distance",
      cats: "Doesn't really care",
      favoriteActivity: "Watching the world",
      whenWantingSomething: "Stare at me",
      vibe: "Sassy & opinionated",
    },
    popularity: 0,
  },
  {
    name: "Taco",
    description:
      "Taco is pure chaotic energy — loud, playful, and full of opinions. They love everyone on sight and demand cuddles loudly.",
    owner: "mocha@example.com",
    personality: {
      energy: "Energetic & playful",
      affection: "Always wants cuddles",
      vocal: "Has an opinion about EVERYTHING",
      strangers: "Immediately says hello",
      cats: "Loves everyone",
      favoriteActivity: "Playing",
      whenWantingSomething: "Demand it loudly",
      vibe: "Silly & Chaotic",
    },
    popularity: 2,
  },
  {
    name: "Gizmo",
    description:
      "Gizmo is confident, clever, and convinced the household revolves around them. They have an opinion about everything and will find their own way to get whatever they want.",
    owner: "bobo@example.com",
    personality: {
      energy: "Energetic & playful",
      affection: "I am their servant",
      vocal: "Has an opinion about EVERYTHING",
      strangers: "Watches from a safe distance",
      cats: "Doesn't really care",
      favoriteActivity: "Playing",
      whenWantingSomething: "Find a way to get it themselves",
      vibe: "Confident & bossy",
    },
    popularity: 0,
  },
  {
    name: "Latte",
    description:
      "Latte is a cozy, sweet cat who loves cuddles and naps in equal measure. They warm up slowly to strangers, but once they do, they'll follow you around for affection.",
    owner: "jenny@example.com",
    personality: {
      energy: "Chill & relaxed",
      affection: "Always wants cuddles",
      vocal: "Occasional meows",
      strangers: "Slowly warms up",
      cats: "Likes having a friend",
      favoriteActivity: "Sleeping",
      whenWantingSomething: "Follow me around",
      vibe: "Sweet & gentle",
    },
    popularity: 1,
  },
  {
    name: "Mango",
    description:
      "Mango has opinions about everything and a regal air to match. They watch the world like a queen surveying their kingdom, and demand service with a loud meow.",
    owner: "jenny@example.com",
    personality: {
      energy: "Balanced",
      affection: "I am their servant",
      vocal: "Has an opinion about EVERYTHING",
      strangers: "Watches from a safe distance",
      cats: "Doesn't really care",
      favoriteActivity: "Watching the world",
      whenWantingSomething: "Demand it loudly",
      vibe: "Sassy & opinionated",
    },
    popularity: 0,
  },

  // --- Additional seeded cats: batch 1 of 3 ---
  {
    name: "Luna",
    description:
      "Luna is sweet and gentle, taking life at their own steady pace. They warm up slowly, but once you've earned their trust, they'll follow you from room to room.",
    owner: "bobo@example.com",
    personality: {
      energy: "Balanced",
      affection: "Affectionate on their terms",
      vocal: "Occasional meows",
      strangers: "Slowly warms up",
      cats: "Likes having a friend",
      favoriteActivity: "Watching the world",
      whenWantingSomething: "Follow me around",
      vibe: "Sweet & gentle",
    },
    popularity: 1,
  },
  {
    name: "Milo",
    description:
      "Milo is a chatty, cuddly ball of energy who says hello to everyone immediately. Always ready to play and quick with a meow, they simply love everyone.",
    owner: "jenny@example.com",
    personality: {
      energy: "Energetic & playful",
      affection: "Always wants cuddles",
      vocal: "Pretty chatty",
      strangers: "Immediately says hello",
      cats: "Loves everyone",
      favoriteActivity: "Playing",
      whenWantingSomething: "Meow",
      vibe: "Silly & Chaotic",
    },
    popularity: 2,
  },
  {
    name: "Coco",
    description:
      "Coco is a shy, independent cat who prefers quiet corners and long naps. They hide at the first sign of company and rarely make a peep.",
    owner: "mocha@example.com",
    personality: {
      energy: "Chill & relaxed",
      affection: "Pretty independent",
      vocal: "Almost silent",
      strangers: "Hides immediately",
      cats: "Prefers being alone",
      favoriteActivity: "Sleeping",
      whenWantingSomething: "Stare at me",
      vibe: "Shy & sensitive",
    },
    popularity: 0,
  },
  {
    name: "Pepper",
    description:
      "Pepper is sassy, confident, and not shy about voicing their opinions. They'll watch you from a distance until they want something — then demand it loudly.",
    owner: "bobo@example.com",
    personality: {
      energy: "Energetic & playful",
      affection: "I am their servant",
      vocal: "Has an opinion about EVERYTHING",
      strangers: "Watches from a safe distance",
      cats: "Doesn't really care",
      favoriteActivity: "Eating",
      whenWantingSomething: "Demand it loudly",
      vibe: "Sassy & opinionated",
    },
    popularity: 1,
  },
  {
    name: "Nori",
    description:
      "Nori is a sweet, gentle cat who warms up slowly but deeply. Occasional meows are reserved for trusted friends and, most importantly, mealtime.",
    owner: "jenny@example.com",
    personality: {
      energy: "Balanced",
      affection: "Affectionate on their terms",
      vocal: "Occasional meows",
      strangers: "Slowly warms up",
      cats: "Likes having a friend",
      favoriteActivity: "Eating",
      whenWantingSomething: "Meow",
      vibe: "Sweet & gentle",
    },
    popularity: 0,
  },
  {
    name: "Olive",
    description:
      "Olive is a calm, sweet cat who treasures attention and cuddles. They warm up slowly, but once you're a friend, they'll follow you around gently asking for more.",
    owner: "mocha@example.com",
    personality: {
      energy: "Chill & relaxed",
      affection: "Always wants cuddles",
      vocal: "Occasional meows",
      strangers: "Slowly warms up",
      cats: "Likes having a friend",
      favoriteActivity: "Getting attention",
      whenWantingSomething: "Follow me around",
      vibe: "Sweet & gentle",
    },
    popularity: 2,
  },
  {
    name: "Biscuit",
    description:
      "Biscuit is a confident, chatty cat who greets every guest with enthusiasm. They love everyone and have no problem demanding a snack at top volume.",
    owner: "bobo@example.com",
    personality: {
      energy: "Balanced",
      affection: "Always wants cuddles",
      vocal: "Pretty chatty",
      strangers: "Immediately says hello",
      cats: "Loves everyone",
      favoriteActivity: "Eating",
      whenWantingSomething: "Demand it loudly",
      vibe: "Confident & bossy",
    },
    popularity: 1,
  },
  {
    name: "Pickles",
    description:
      "Pickles is playful and independent, with an opinion about everything under the sun. They'd rather solve their own problems than ask for help.",
    owner: "jenny@example.com",
    personality: {
      energy: "Energetic & playful",
      affection: "Pretty independent",
      vocal: "Has an opinion about EVERYTHING",
      strangers: "Watches from a safe distance",
      cats: "Doesn't really care",
      favoriteActivity: "Playing",
      whenWantingSomething: "Find a way to get it themselves",
      vibe: "Sassy & opinionated",
    },
    popularity: 0,
  },
  {
    name: "Waffles",
    description:
      "Waffles is a chatty, playful goofball who says hello to everyone they meet. Silly and affectionate on their terms, they love a good game above all.",
    owner: "mocha@example.com",
    personality: {
      energy: "Energetic & playful",
      affection: "Affectionate on their terms",
      vocal: "Pretty chatty",
      strangers: "Immediately says hello",
      cats: "Loves everyone",
      favoriteActivity: "Playing",
      whenWantingSomething: "Meow",
      vibe: "Silly & Chaotic",
    },
    popularity: 1,
  },
  {
    name: "Tofu",
    description:
      "Tofu is a shy, independent cat who finds comfort in quiet and sleep. They hide from visitors, stay nearly silent, and give affection only on their own terms.",
    owner: "bobo@example.com",
    personality: {
      energy: "Chill & relaxed",
      affection: "Pretty independent",
      vocal: "Almost silent",
      strangers: "Hides immediately",
      cats: "Prefers being alone",
      favoriteActivity: "Sleeping",
      whenWantingSomething: "Stare at me",
      vibe: "Shy & sensitive",
    },
    popularity: 0,
  },
];

/** Guestbook entries (UserCat join rows): users adding cats owned by others. */
const USER_CATS = [
  { user: "bobo@example.com", cat: "Bobo" },
  { user: "jenny@example.com", cat: "Bobo" },
  { user: "mocha@example.com", cat: "Mochi" },
];

// Prisma 7 requires a driver adapter at runtime. This mirrors
// db/db.js (the pool + adapter pattern used by the API).
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  let usersCreated = 0;
  let catsCreated = 0;
  let guestbookCreated = 0;
  let descriptionsUpdated = 0;

  // 1. Users — upsert by email (the unique column); existing rows are skipped.
  const userIdByEmail = {};
  for (const { username, email } of USERS) {
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const passwordHash = await bcrypt.hash(DEMO_PASSWORD, BCRYPT_ROUNDS);
      user = await prisma.user.create({
        data: { username, email, passwordHash },
      });
      usersCreated += 1;
    }
    userIdByEmail[email] = user.id;
  }

  // 2. Cats — no unique key on Cat, so match on the (name, ownerId) pair.
  const catIdByName = {};
  for (const { name, owner, description, personality, popularity } of CATS) {
    const ownerId = userIdByEmail[owner];
    if (!ownerId) {
      throw new Error(`Seed cat "${name}" references unknown owner "${owner}".`);
    }
    const existing = await prisma.cat.findFirst({ where: { name, ownerId } });
    if (!existing) {
      const cat = await prisma.cat.create({
        data: { name, description, ownerId, personality, popularity },
      });
      catIdByName[name] = cat.id;
      catsCreated += 1;
    } else {
      // Backfill copy descriptions without overwriting anything a user wrote.
      if (description && !existing.description) {
        await prisma.cat.update({
          where: { id: existing.id },
          data: { description },
        });
        descriptionsUpdated += 1;
      }
      catIdByName[name] = existing.id;
    }
  }

  // 3. Guestbook entries — the UserCat model has a unique (userId, catId)
  //    constraint, so checks + creates keep this re-runnable.
  for (const { user, cat } of USER_CATS) {
    const userId = userIdByEmail[user];
    const catId = catIdByName[cat];
    if (!userId || !catId) {
      throw new Error(
        `Seed guestbook entry references unknown user "${user}" or cat "${cat}".`
      );
    }
    const exists = await prisma.userCat.findUnique({
      where: { userId_catId: { userId, catId } },
    });
    if (!exists) {
      await prisma.userCat.create({ data: { userId, catId } });
      guestbookCreated += 1;
    }
  }

  if (
    usersCreated > 0 ||
    catsCreated > 0 ||
    guestbookCreated > 0 ||
    descriptionsUpdated > 0
  ) {
    console.log(
      [
        `Seeded ${usersCreated} new user(s), ${catsCreated} new cat(s),`,
        `${guestbookCreated} new guestbook entr(ies).`,
        `Backfilled ${descriptionsUpdated} cat description(s).`,
        `Demo password for all users: ${DEMO_PASSWORD}`,
      ].join(" ")
    );
  } else {
    console.log("Nothing to seed — users, cats, and entries already exist.");
  }
}

async function close() {
  await prisma.$disconnect();
  await pool.end();
}

main()
  .then(close)
  .catch(async (err) => {
    console.error("Seeding failed:", err);
    await close();
    process.exit(1);
  });
