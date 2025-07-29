# Use Node base image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy only package files first (for caching)
COPY package*.json ./

# Install dependencies (including Prisma CLI + client)
RUN npm install

# Copy the rest of your app including prisma/schema.prisma
COPY . .

# Generate Prisma client
RUN npx prisma generate


# Expose your app port and Prisma Studio port
EXPOSE 5000
EXPOSE 5555

# Start your app
CMD ["node", "index.js"]
