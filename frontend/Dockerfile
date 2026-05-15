# --- Dependencies Stage ---
FROM node:22-alpine AS deps
WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# --- Build Stage ---
FROM node:22-alpine AS builder
WORKDIR /opt/app
COPY --from=deps /opt/app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- Production Runner ---
FROM node:22-alpine AS runner
WORKDIR /opt/app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /opt/app/public ./public
COPY --from=builder --chown=nextjs:nodejs /opt/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /opt/app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

# --- Dev Target ---
FROM node:22-alpine AS dev
WORKDIR /opt/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
