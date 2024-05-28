# Use the official Node.js 20 image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the wait-for-it script
COPY wait-for-it.sh /usr/src/app/

# Make the script executable
RUN chmod +x wait-for-it.sh

# Expose the application port
EXPOSE 8080

# Start the application, waiting for the database to be ready
CMD ["./wait-for-it.sh", "db:5432", "--", "npm", "start"]
