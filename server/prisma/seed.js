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
 * re-run safely.
 */

/** Accounts to create. Identified by email (the unique column). */
const USERS = [
  { username: "bobo", email: "bobo@example.com" },
  { username: "jenny", email: "jenny@example.com" },
  { username: "mocha", email: "mocha@example.com" },
];

/**
 * Cats to create. `owner` references a user's email from USERS. `personality`
 * uses the shape produced by the client's personality quiz
 * (client/src/components/createCat/personalityQuiz.tsx). `popularity` starts
 * at the number of guestbook entries that add this cat below.
 */
const CATS = [
  {
    name: "Bobo",
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
  for (const { name, owner, personality, popularity } of CATS) {
    const ownerId = userIdByEmail[owner];
    if (!ownerId) {
      throw new Error(`Seed cat "${name}" references unknown owner "${owner}".`);
    }
    const existing = await prisma.cat.findFirst({ where: { name, ownerId } });
    if (!existing) {
      const cat = await prisma.cat.create({
        data: { name, ownerId, personality, popularity },
      });
      catIdByName[name] = cat.id;
      catsCreated += 1;
    } else {
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

  if (usersCreated > 0 || catsCreated > 0 || guestbookCreated > 0) {
    console.log(
      [
        `Seeded ${usersCreated} new user(s), ${catsCreated} new cat(s),`,
        `${guestbookCreated} new guestbook entr(ies).`,
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
