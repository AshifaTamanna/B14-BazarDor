# বাজার দর — BazarDor

বাজার দর is a responsive Bengali-first market-price guide for essential groceries in Bangladesh. Browse today's prices and market trends, compare local bazar prices, and keep track of changes in one place.

## Technologies

- Next.js App Router and React
- TypeScript
- Tailwind CSS 4 with custom responsive styling
- Better Auth with local SQLite or MongoDB, email/password, Google, and GitHub providers
- Live product and category data from the BazarDor API
- Lucide icons and react-hot-toast

## Features

1. Bengali price ticker, date, categories, and mobile-friendly navigation.
2. Live price-rise and price-fall highlights with Bengali numerals.
3. Responsive product cards and category pages with numeric price sorting.
4. Protected product details with market-by-market minimum, maximum, and average prices.
5. Email/password registration and login, with optional Google and GitHub OAuth.
6. Successful registration returns users to sign-in; successful sign-in opens the market dashboard.
7. Profile page and name update form.
8. Loading skeletons, clear error states, and friendly 404 pages.
9. A saved market-data snapshot keeps the catalog available during upstream API outages and labels those prices as saved rather than live.

## Getting started

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set `BETTER_AUTH_SECRET`. For local development, SQLite is created automatically at `.data/auth.sqlite`; MongoDB is optional.
3. Add Google and/or GitHub OAuth credentials to enable those social login buttons. Set each provider's callback URL to `http://localhost:3000/api/auth/callback/google` or `/api/auth/callback/github`.
4. Run `npm run dev` and open `http://localhost:3000`.

The product catalog is loaded from `https://api.api-store.workers.dev/api/bazardor` with `https://api.abcz.workers.dev/api/bazardor` as an alternate source. If both APIs are unavailable, the app serves the saved snapshot at `src/data/bazar-snapshot.json` and clearly warns users that its prices may be outdated. For Vercel deployment, configure `MONGODB_URI` and `BETTER_AUTH_SECRET` in the project environment, then set the production app URL as `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL`. Local SQLite is intended for development and is not persistent on serverless hosts.
