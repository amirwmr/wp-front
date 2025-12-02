FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
COPY svelte.config.js tsconfig.json vite.config.ts tailwind.config.cjs postcss.config.cjs ./
RUN npm install --engine-strict=false

COPY src ./src
COPY static ./static

ENV HOST=0.0.0.0
ENV PORT=5173

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
