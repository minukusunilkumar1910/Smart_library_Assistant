📚 Smart Library Assistant System

A full-stack web application that digitizes and automates library management by enabling seat booking, book tracking, return alerts, and real-time updates for students and library staff.

Built using the MERN Stack (MongoDB, Express, React, Node.js), the system replaces manual processes with an efficient, user-friendly digital solution.

🚀 Problem Statement

Traditional college libraries manage:

Manual seat allocation

Paper-based book records

Manual return reminders

Time-consuming tracking

This leads to:

Wasted time

Overcrowding

Lost books

Missed return dates

👉 Smart Library Assistant solves these issues through automation.

✨ Features
👨‍🎓 Student

Login/Register

View available seats

Book seats in library

Borrow books

Track borrowed books

Get return date alerts

👩‍💼 Library Staff / Admin

Add / update / delete books

Track issued books

Monitor seat usage

View student activity

Manage records in real-time

🔔 System Features

Real-time updates

Book return reminders

Secure authentication

Dashboard view

Centralized database

🛠️ Tech Stack
Frontend

React.js

HTML

CSS

JavaScript

Backend

Node.js

Express.js

Database

MongoDB

Tools

Git & GitHub

Postman (API testing)

🏗️ Architecture
Client (React)
      ↓
Express API Server (Node.js)
      ↓
MongoDB Database


Flow:

User sends request

Backend processes logic

Data stored/retrieved from MongoDB

Response sent back to UI

⚙️ Installation & Setup
1️⃣ Clone repository
git clone https://github.com/minukusunilkumar1910/Smart_library_Assistant
cd Smart_library_Assistant

2️⃣ Install dependencies

Backend:

cd backend
npm install


Frontend:

cd frontend
npm install

3️⃣ Setup environment variables

Create .env inside backend:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

4️⃣ Run project

Backend:

npm start


Frontend:

npm start


Open:

http://localhost:3000

🔐 Authentication

JWT-based authentication

Role-based access

Student

Admin/Staff

Protected routes for secure operations

📊 Key Learning Outcomes

Through this project, I learned:

Full stack MERN development

REST API design

Authentication & authorization

Database schema design

Real-world requirement gathering

Team collaboration

Debugging & testing with Postman

🎯 Future Improvements

QR-based seat booking

Email/SMS reminders

Barcode book scanning

Admin analytics dashboard

Deployment on AWS

📸 Demo / Repository

GitHub:
👉 https://github.com/minukusunilkumar1910/Smart_library_Assistant

👨‍💻 Author

Sunilkumar Minuku
B.Tech CSE (AI/ML)
Full Stack & DevOps Enthusiast

GitHub: https://github.com/minukusunilkumar1910

LinkedIn: https://linkedin.com/in/minukusunilkumar
