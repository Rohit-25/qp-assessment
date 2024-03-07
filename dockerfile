# Use an official Node.js image as a base image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Run prisma generate during build
RUN npx prisma generate

# Expose the port your app will run on (change accordingly)
EXPOSE 3000

# # Set the environment variable for the database URL for Docker environment
# ENV DATABASE_URL=mysql://rohit:rohit123@mysql:3306/mytask


# Start the application
CMD ["npm", "start"]
