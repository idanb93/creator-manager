# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the application files to the working directory
COPY . .

# Install dependencies
RUN npm install --legacy-peer-deps

# Expose PORT to external Environment
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]