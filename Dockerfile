# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

ARG PUBLIC_BACKEND_URL
ENV PUBLIC_BACKEND_URL=$PUBLIC_BACKEND_URL

COPY . .
RUN npm run build

RUN npm prune --production

# Stage 2: Runner
FROM node:22-alpine AS runner

RUN addgroup -S nodejs && adduser -S astro -G nodejs

WORKDIR /app

COPY --from=builder --chown=astro:nodejs /app/dist ./dist
COPY --from=builder --chown=astro:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=astro:nodejs /app/package.json ./package.json

USER astro

EXPOSE 4321

ENV HOST=0.0.0.0 PORT=4321 NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --spider http://localhost:4321/ || exit 1

CMD ["node", "dist/server/entry.mjs"]
