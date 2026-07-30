# Campus Marketplace

A student-to-student marketplace for buying and selling secondhand goods within a campus community — textbooks, electronics, dorm furniture, lab equipment, and more. Students can list items, browse and filter what others are selling, place bids, and message sellers directly.

**Live app:** https://dorm-deals-marketplace.vercel.app/

## Features

- **Listings** — Create, edit, and delete item listings with title, description, price, category, condition, and images.
- **Browse & filter** — Search by keyword and filter by category and price range.
- **Bidding** — Buyers place bids on listings; sellers accept or reject them.
- **Direct messaging** — One-to-one conversations between buyers and sellers.
- **Authentication** — Email/password sign-up (with email verification) and login, powered by Supabase Auth.
- **My listings** — Manage everything you've posted from a single dashboard.

Categories include textbooks, electronics, furniture, clothing, kitchen, school supplies, engineering tools, lab equipment, dorm essentials, and other. Item condition ranges across new, like-new, good, fair, and poor.

## Tech Stack

- **Build tool:** Vite
- **Language:** TypeScript
- **Framework:** React 18
- **UI components:** shadcn/ui (Radix primitives)
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **Data fetching:** TanStack Query
- **Forms & validation:** React Hook Form + Zod
- **Backend:** Supabase (Postgres, Auth)
- **Hosting:** Vercel

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18 or later
- npm (bundled with Node)
- A [Supabase](https://supabase.com) project (for auth and data)

### Installation

```sh
git clone <REPOSITORY_URL>
cd campus-marketplace
npm install
```

### Environment Variables

Create a `.env` file in the project root with your Supabase credentials:

```sh
VITE_SUPABASE_URL="https://<your-project>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="<your-anon-key>"
VITE_SUPABASE_PROJECT_ID="<your-project-id>"
```

All variables must be prefixed with `VITE_` to be exposed to the client. Only the Supabase publishable (anon) key belongs here — never commit a service-role key.

### Development

```sh
npm run dev
```

The app runs at `http://localhost:5173` by default.

### Production Build

```sh
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Vite dev server with hot reloading |
| `npm run build` | Build for production |
| `npm run build:dev` | Build using development mode |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

## Project Structure

```
src/
├── components/        # Reusable UI (including shadcn/ui in components/ui)
├── contexts/          # AuthContext and other React contexts
├── integrations/
│   └── supabase/      # Supabase client and generated types
├── pages/             # Route-level views (Landing, Listings, Messages, ...)
├── services/          # Data access layer over Supabase
├── types/             # Shared domain types (Listing, Bid, Message, ...)
└── App.tsx            # App shell and route definitions
```

## Routes

Public: `/` (landing), `/listings`, `/listing/:id`, `/login`, `/signup`

Protected (require login): `/new-listing`, `/edit-listing/:id`, `/my-listings`, `/bids`, `/messages`

## Data Model

The Supabase backend is organized around four main tables:

- **profiles** — public user info (username, avatar)
- **products** — listings (title, description, price, category, condition, images, seller, status)
- **bids** — offers on a product, each with an amount and a pending/accepted/rejected status
- **messages** — direct messages between users; conversations are derived from message history

## Deployment

The app is deployed on Vercel. Push to the connected branch to trigger a build, and make sure the `VITE_SUPABASE_*` environment variables are configured in your Vercel project settings.

## License

[Specify a license, e.g. MIT. See LICENSE for details.]
