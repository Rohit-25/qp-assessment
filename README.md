# Grocery Booking API

This TypeScript Node.js API is designed for managing grocery items and orders. The project leverages the Prisma ORM for MySQL database integration, providing a robust solution for grocery management.

# Requirements

Node.js
TypeScript
MySQL
Prisma
Docker

# Installation

1. Clone the repository:

git clone https://github.com/Rohit-25/qp-assessment.git

cd GROCERYITEM

2. Install dependencies:

npm install

Set up your MySQL database and update the database connection details in the .env file.

3. Generate Prisma Client:

npx prisma generate

4. Run migrations:

npx prisma migrate dev

5. Start the server:

npm start
The API will be available at http://localhost:3000.

# API Endpoints

Please refer to the below link of Postman Collection for details on available endpoints and examples:
https://shreewebworld.postman.co/workspace/mytask123~3555da6b-08b7-483c-af92-284ac5ac7d25/request/23982550-fcc56f60-c445-4f9e-a5b9-e5616679df75

# Docker Integration

The entire application has been containerized using Docker for easy deployment.

Build Docker Image
To build the Docker image, use the following command:

docker-compose build

Run Docker Container
To run the application within a Docker container, execute:

docker-compose up

Conclusion
This Grocery Booking API provides a robust solution for managing grocery items and orders. Feel free to explore the Postman Collection for a detailed overview of available endpoints and examples.The Docker integration further streamlines the deployment process.
