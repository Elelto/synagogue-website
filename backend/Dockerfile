FROM node:18-alpine

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache openssl

# Add package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Add all project files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Start the app
CMD ["npm", "run", "dev"]
