# Auth Test Monorepo

An ugly playground for testing how Next.js, Nest.js, Prisma, and Turborepo work together for an auth server w/ roles and refresh tokens.

## Workspaces
```
- apps/web: Next.js web application
- apps/api: Nest.js API server
- packages/db: Prisma schema and client definition
```

## To start application
1. Add environment variables to `.env`

2. Install dependencies
```
yarn install
```

3. Sync Prisma with database
```
yarn db:push db:generate
```

4. Install generated client to its dependants
```
yarn install
```

5. Run dev servers and Prisma Studio
```
yarn dev
```