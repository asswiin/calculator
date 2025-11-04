# Dockerfile

# ---- Build Stage (for React Client) ----
# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS build
WORKDIR /app

# Copy client's package files and install dependencies
COPY client/package.json client/package-lock.json ./client/
RUN cd client && npm install

# Copy the rest of the client's source code
COPY client/ ./client/

# Build the React app for production
RUN cd client && npm run build

# ---- Production Stage (for Node.js Server) ----
# Use a slim, secure base image
FROM node:18-alpine
WORKDIR /app

# Copy server's package files and install only production dependencies
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm install --only=production

# Copy the rest of the server's source code
COPY server/ ./server/

# Copy the built React app from the 'build' stage
COPY --from=build /app/client/build ./client/build

# Expose the port the app will run on
EXPOSE 5000

# Set the environment to production
ENV NODE_ENV=production

# The command to run the application
CMD ["node", "server/server.js"]