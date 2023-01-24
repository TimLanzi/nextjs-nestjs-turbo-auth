# Auth Test Monorepo

An ugly playground for testing how Next.js, Nest.js, Prisma, and Turborepo work together for an auth server w/ roles and refresh tokens.

## Workspaces
```
- apps/web: Next.js web application
- apps/api: Nest.js API server
- packages/config: Tailwind config files
- packages/db: Prisma schema and client definition
- packages/eslint-config-custom: Custom eslint config
- packages/tsconfig: Tsconfig files
```

## To start application
1. Add environment variables to `.env`

2. Make sure turbo is installed globally
```
npm install turbo --global
# or
yarn global add turbo
# or
pnpm install turbo --global
```

2. Install dependencies
```
pnpm install
```

3. Sync Prisma with database
```
turbo db:push db:generate
```

4. Run dev servers and Prisma Studio
```
pnpm dev
```

## Updating Prisma Schema
Run the following:
```
pnpm db:push db:generate
```