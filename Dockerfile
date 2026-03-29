# ---- Build stage ----
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Run schema validation tests; fail the build if they fail
RUN npm test

# ---- Serve stage ----
FROM nginx:1.27-alpine AS serve

# Remove default nginx config and replace with ours
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy site assets from build stage
COPY --from=build /app/index.html    /usr/share/nginx/html/
COPY --from=build /app/config.js     /usr/share/nginx/html/
COPY --from=build /app/favicon.svg   /usr/share/nginx/html/
COPY --from=build /app/favicon.ico   /usr/share/nginx/html/
COPY --from=build /app/resume        /usr/share/nginx/html/resume
COPY --from=build /app/src           /usr/share/nginx/html/src
COPY --from=build /app/themes        /usr/share/nginx/html/themes

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1
