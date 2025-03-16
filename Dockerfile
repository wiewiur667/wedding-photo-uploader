# Build Stage 1

FROM node:22-slim AS build
WORKDIR /app

RUN corepack enable

# Copy package.json and your lockfile, here we add pnpm-lock.yaml for illustration
COPY ./package.json ./pnpm-lock.yaml .npmrc ./

ENV DB_FILE_NAME=file:./.data/db.sqlite3
ENV UPLOADS_DIR=.data/uploads

# Install dependencies
RUN pnpm i

# Copy the entire project
COPY . ./

# Build the project

RUN mkdir /app/.data

RUN pnpm drizzle-kit push
RUN pnpm run build


# Build Stage 2

FROM node:22-slim
WORKDIR /app

# Only `.output` folder is needed from the build stage
COPY --from=build /app/.output/ ./
COPY --from=build /app/.data/ ./.data/


# Change the port and host
ENV PORT=80
ENV HOST=0.0.0.0

EXPOSE 80

CMD ["node", "/app/server/index.mjs"]
 