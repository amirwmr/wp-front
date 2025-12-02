FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY svelte.config.js tsconfig.json vite.config.ts tailwind.config.cjs postcss.config.cjs ./
RUN npm ci --engine-strict=false

COPY src ./src
COPY static ./static

RUN npm run build

FROM node:24-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY --from=build /app/build ./build
RUN npm ci --omit=dev --engine-strict=false

EXPOSE 3000

CMD ["node", "build/index.js"]
