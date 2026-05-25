# -----------------------------------------------------------------------------
# Multi-stage Dockerfile for Next.js application
# Optimized for production builds with npm
# -----------------------------------------------------------------------------

# Use Node.js official image with build argument
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine AS base

# Setup pnpm environment
RUN corepack enable
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
# Use cache mount for pnpm store to speed up installs
COPY package.json pnpm-lock.yaml* ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack prepare pnpm@10.8.0 --activate && \
    pnpm install --frozen-lockfile --ignore-scripts

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

# Copy config files first (change less frequently) for better cache
COPY next.config.ts tsconfig.json package.json postcss.config.mjs ./

# Copy public assets (change less frequently than source code)
COPY public ./public

# Copy source code (this changes most frequently)
COPY src ./src

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1
ENV BUILD_STANDALONE=true

RUN corepack prepare pnpm@10.8.0 --activate && \
    pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3008

ENV PORT=3008
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]