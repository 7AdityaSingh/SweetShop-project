 Sweet Shop Management System
 Project Description

The Sweet Shop Management System is a full-stack web application designed to manage a sweet shop’s inventory and sales efficiently.
The application supports role-based access, allowing users to browse and purchase sweets, while admins can manage the inventory through a protected admin dashboard.

This project demonstrates practical usage of React, Node.js, Express, SQLite, JWT authentication, and RESTful APIs, along with responsive UI design and backend testing.

Tech Stack
Frontend

React (Create React App)

React Router DOM

Context API

Custom CSS

Responsive Design

Backend

Node.js

Express.js

SQLite

JWT Authentication

Role-based Authorization

Testing

Jest

Supertest

✨ Features

🔐 User authentication (Register / Login)

👥 Role-based access (Admin / User)

🍭 View available sweets

🔍 Search and filter sweets by category

🛒 Purchase sweets with stock validation

🧑‍💼 Admin dashboard:

Add sweets

Edit sweets

Delete sweets

Restock sweets

📱 Fully responsive UI (desktop, tablet, mobile)

🧪 Backend API testing

Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/7AdityaSingh/SweetShop-project.git
cd SweetShop-project

2️⃣ Backend Setup
cd backend
npm install


Create a .env file in the backend folder:

JWT_SECRET=your_jwt_secret
PORT=5000


Start the backend server:

npm start


Backend runs on:

http://localhost:5000

3️⃣ Frontend Setup
cd frontend
npm install
npm start


Frontend runs on:

http://localhost:3000

🧪 Running Tests

To run backend tests:

cd backend
npm test

📊 Test Report Summary

Authentication routes tested

Protected admin routes tested

Sweet CRUD operations tested

Purchase & stock validation tested

✅ All tests passed successfully.