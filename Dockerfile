# ===============================
# Base
# ===============================
FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

# ===============================
# Dependencies
# ===============================
FROM base AS dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ===============================
# Build
# ===============================
FROM base AS build
COPY package.json pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY src ./src
COPY --from=dependencies /app/node_modules ./node_modules
RUN pnpm build

# ===============================
# Runtime
# ===============================
FROM node:22-alpine AS deploy
WORKDIR /app
ENV NODE_ENV=production
RUN corepack enable

COPY package.json ./
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 3333
CMD ["node", "dist/index.js"]
