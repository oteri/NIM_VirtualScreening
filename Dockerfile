# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory to /app
WORKDIR /app

# Install Vite globally
RUN npm install -g create-vite

# Create a new Vue project with TypeScript template
RUN npm create vite@latest my-vue-app -- --template vue-ts

# Change to the project directory
WORKDIR /app/my-vue-app

# Install Tailwind CSS, Autoprefixer, and types for Node.js
RUN npm install -D tailwindcss autoprefixer @types/node

# Copy the necessary configuration files from the host
COPY vite.config.ts tsconfig.json ./

# Initialize Shadcn Vue
RUN npx shadcn-vue@latest init

# Add the Button component
RUN npx shadcn-vue@latest add button

# Install remaining npm packages
RUN npm install

# Build the app for production
RUN npm run build

# Start the server using Vite's preview mode
CMD ["npm", "run", "preview"]
