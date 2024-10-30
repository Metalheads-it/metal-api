# syntax=docker/dockerfile:1

FROM node:20-alpine AS build-env

WORKDIR /build-stage

# Clean install all dependencies
COPY package*.json ./
RUN npm ci --ignore-scripts

# Build the application
ENV NODE_ENV=production
COPY tsconfig*.json ./
COPY src src
RUN npm run build

# Clean install production dependencies
RUN npm ci --omit=dev --ignore-scripts

FROM alpine:3

WORKDIR /usr/src/app

# Add required binaries
RUN apk add --no-cache libstdc++ dumb-init \
  && addgroup -g 1000 node && adduser -u 1000 -G node -s /bin/sh -D node

COPY --from=build-env /usr/local/bin/node /usr/local/bin/
COPY --from=build-env /usr/local/bin/docker-entrypoint.sh /usr/local/bin/

# Adjust ownership after copying files
RUN chown -R node:node /usr/src/app

ENTRYPOINT ["docker-entrypoint.sh"]

USER node
COPY --from=build-env /build-stage/node_modules ./node_modules
COPY --from=build-env /build-stage/dist ./dist
# Run with dumb-init to not start node with PID=1, since Node.js was not designed to run as PID 1
CMD ["dumb-init", "node", "dist/index.js"]