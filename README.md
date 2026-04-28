# Frontend Client

Google Classroom AI-powered catch-up lesson generator web application.

## Prerequisites

- Node.js 24+
- npm, yarn, or pnpm

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your configuration:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your backend API URL.

## Installation

```bash
npm install
# or
yarn install
# or
pnpm install
```

## Running

### Development Mode
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm run start
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Custom UI components + shadcn/ui
- **HTTP Client**: Axios
- **State Management**: React Context (Auth)

## Project Structure

```
client/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── login/             # Login page
│   ├── course/            # Course pages
│   └── student/           # Student pages
├── components/
│   ├── screens/           # Page-level components
│   ├── shared/            # Reusable components
│   └── ui/                # UI library components
├── http/                  # API client functions
├── lib/                   # Utilities and constants
└── providers/             # React context providers
```

