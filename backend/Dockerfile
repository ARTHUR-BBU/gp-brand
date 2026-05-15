# --- Install Stage ---
FROM node:22-alpine AS deps
WORKDIR /opt/app
COPY package.json package-lock.json* ./
RUN npm ci

# --- Build Stage ---
FROM node:22-alpine AS build
WORKDIR /opt/app
COPY --from=deps /opt/app/node_modules ./node_modules
COPY . .
RUN npm run build

# --- Production Stage ---
FROM node:22-alpine AS production
WORKDIR /opt/app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 strapi && \
    adduser --system --uid 1001 strapi

COPY --from=build /opt/app/node_modules ./node_modules
COPY --from=build /opt/app/dist ./dist
COPY --from=build /opt/app/package.json ./
COPY --from=build /opt/app/config ./config
COPY --from=build /opt/app/public ./public

RUN chown -R strapi:strapi /opt/app

USER strapi
EXPOSE 1337

CMD ["npm", "start"]

# --- Dev Stage ---
FROM node:22-alpine AS develop
WORKDIR /opt/app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
EXPOSE 1337
CMD ["npm", "run", "develop"]
