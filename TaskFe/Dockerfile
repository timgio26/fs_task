# Stage 1: Build the React app
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the built app
# FROM node:18-alpine
# WORKDIR /app

# RUN npm install -g serve

# COPY --from=builder /app/dist ./dist
# EXPOSE 3000
# CMD ["serve", "-s", "dist"]

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

