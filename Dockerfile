FROM node:22

# Set the working directory to /app
WORKDIR /app

# Copy dependency files first for better cache
COPY package.json package-lock.json bun.lock jsconfig.json ./

COPY /src/ ./

# Install dependencies
RUN npm install


# Start the application
CMD ["npm", "start"]
