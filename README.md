# Bobo's Book of Friends

A full-stack guestbook for cats. Create a virtual cat with a personality quiz,
discover other people's cats, and chat with them — each one roleplays its own
personality, powered by an LLM.

See here at: https://bobo-guestbook.netlify.app/

## Features

- **Create a cat** — answer a personality quiz (core personality, behavior, and
  flavor) to generate a unique cat profile, then give it an avatar, a
  description, and a name.
- **Discover** — browse every cat in the book, newest first, and open any
  profile to see its personality and chat with it.
- **Chat with cats** — each cat roleplays its personality and description;
  conversations are persisted for signed-in users and kept in `localStorage`
  for guests.
- **Recent chats** — pick up where you left off with any cat you've talked to.
- **Auth** — sign up and log in with email/username and password; sessions use
  JWT.

## Tech stack

| Layer    | Tech                                                       |
| -------- | ---------------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, react-router-dom |
| Backend  | Express 5 (ESM), Prisma 7, PostgreSQL                      |
| Auth     | JWT (`jsonwebtoken`), `bcryptjs`                           |
| External | OpenRouter (chat LLM), ImageKit (image uploads)            |

## Project structure

```
bobo-guestbook/
├── server/                 # Express API + Prisma schema/seed
│   ├── prisma/             # schema.prisma, migrations, seed.js
│   ├── routes/             # auth, cats, chat, imageUpload
│   ├── services/cats/      # LLM roleplay prompt + reply generation
│   ├── db/db.js            # Prisma client
│   └── server.js           # app entrypoint
├── client/                 # React + Vite frontend
│   └── src/
│       ├── components/     # auth, chat, createCat, discoverCat, ui
│       ├── hooks/          # data-fetching hooks
│       ├── lib/            # API client, guest chat storage
│       └── pages/          # Cat, Discover, MyCats, CreateCat
└── AGENTS.md
```

## Getting started

Prerequisites: Node.js, and a PostgreSQL database (local or remote).

### 1. Server

```bash
cd server
npm install
```

Create `server/.env` with the following variables:

| Variable               | Used for                                |
| ---------------------- | --------------------------------------- |
| `DATABASE_URL`         | PostgreSQL connection string for Prisma |
| `JWT_SECRET`           | Secret used to sign auth tokens         |
| `OPENROUTER_API_KEY`   | LLM API key for cat chat replies        |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key (avatar uploads)   |
| `IMAGEKIT_PUBLIC_KEY`  | ImageKit public key (avatar uploads)    |

Apply the schema and seed the database (optional but recommended — see demo
accounts below):

```bash
npm run db:migrate
npm run db:seed
```

Start the server:

```bash
npm run dev        # nodemon, restarts on change
```

The API runs at `http://localhost:3000` by default (override with `PORT`).

### 2. Client

```bash
cd client
npm install
```

Create `client/.env`:

```
VITE_API_PROXY_TARGET=http://localhost:3000
```

In dev the Vite server proxies `/api` to this target, so no CORS setup is
needed. When deploying the client somewhere without a proxy (e.g. Netlify),
point this at your production API URL and the base URL is baked in at build
time.

Start the frontend:

```bash
npm run dev
```

Open http://localhost:5173.

## Scripts

**Server** (`server/`)

| Command              | What it does                     |
| -------------------- | -------------------------------- |
| `npm run dev`        | Start API with nodemon           |
| `npm start`          | Start API with plain Node        |
| `npm run db:migrate` | Apply Prisma migrations          |
| `npm run db:seed`    | Seed users, cats, and guestbook  |
| `npm run lint`       | Lint server code                 |
| `npm run format`     | Format server code with Prettier |

**Client** (`client/`)

| Command           | What it does                        |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Start Vite dev server with HMR      |
| `npm run build`   | Type-check and build for production |
| `npm run preview` | Preview the built site              |
| `npm run lint`    | Lint client code                    |
| `npm run format`  | Format client code with Prettier    |

## Seeded demo accounts

`npm run db:seed` creates three users (all with password `guestbook123`), each
with seeded cats and guestbook entries:

- `bobo@example.com`
- `jenny@example.com`
- `mocha@example.com`

The seed is idempotent — re-running it leaves existing data untouched.

## API overview

All endpoints are mounted under `/api`.

| Method | Endpoint               | Auth | Description                               |
| ------ | ---------------------- | ---- | ----------------------------------------- |
| `POST` | `/create-account`      | —    | Sign up and receive a JWT token           |
| `POST` | `/login`               | —    | Log in with email/username + password     |
| `GET`  | `/imagekit/auth`       | —    | Client-side ImageKit upload credentials   |
| `GET`  | `/cats`                | —    | Paginated list of cats (newest first)     |
| `GET`  | `/cats/:id`            | —    | Single cat with its owner                 |
| `GET`  | `/cats/chatted`        | JWT  | Cats the signed-in user has chatted with  |
| `GET`  | `/my-cats`             | JWT  | Cats owned by the signed-in user          |
| `POST` | `/cats`                | JWT  | Create a cat                              |
| `GET`  | `/chat/history/:catId` | JWT  | Signed-in user's chat history with a cat  |
| `POST` | `/chat`                | —    | Send a message to a cat and get its reply |

Chats don't require auth: guests chat anonymously and their conversations only
live in the browser, while signed-in users get server-persisted history.
