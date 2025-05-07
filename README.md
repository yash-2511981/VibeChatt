# 📱 ViBeChat - Real-Time Chat App

## Overview

**ViBeChat** is a real-time chat application that enables seamless communication through direct messaging and group chats.  
Built with a powerful tech stack including **React, Node.js, Express, MongoDB, Socket.io**, and more, this application delivers a **responsive and intuitive user experience across all devices**.

---

## ✨ Features

- **💬 Real-Time Messaging**  
  Seamless instant messaging powered by **Socket.io**, supporting both **one-on-one** and **group chats**.

- **📍 Message Receipts**  
  Real-time updates for message status: `sent`, `received`, and `seen`, ensuring reliable delivery feedback for users.

- **🖼️ Media Sharing**  
  Share images and files easily with real-time delivery tracking and status updates.

- **📞 Video & Audio Calling**  
  High-quality, real-time **video and audio call** functionality built using WebRTC.

- **🔐 Secure Authentication**  
  User login and authentication handled via **JWT**, ensuring secure and persistent sessions.

- **🗂️ Persistent Message Storage**  
  All messages are stored in **MongoDB**, preserving full conversation history.

- **📱 Fully Responsive UI**  
  Built with **Tailwind CSS** for a sleek, modern, and fully responsive design across all devices.

---

## 🛠 Tech Stack

### 🚀 Frontend

- React ![React](https://img.shields.io/badge/React-20232a?style=flat&logo=react&logoColor=61dafb)
- Tailwind CSS ![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-0ea5e9?style=flat&logo=tailwindcss&logoColor=white)
- Zustand ![Zustand](https://img.shields.io/badge/Zustand-000000?style=flat&logo=zustand&logoColor=white)

### ⚙️ Backend

- Node.js ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
- Express.js ![Express](https://img.shields.io/badge/Express.js-404D59?style=flat)

### 🧱 Database

- MongoDB ![MongoDB](https://img.shields.io/badge/MongoDB-4DB33D?style=flat&logo=mongodb&logoColor=white)

### 🔌 Real-Time Communication

- Socket.io ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socketdotio&logoColor=white)

### 🔐 Authentication

- JWT (JSON Web Token) ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)

### 📁 File Handling

- Multer ![Multer](https://img.shields.io/badge/Multer-ff6f00?style=flat)

### 📞 Video/Audio Calls

- WebRTC API ![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=flat&logo=webrtc&logoColor=white)

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/yash-2511981/ChatApp.git
cd ChatApp
```

2.Install depedencies for both front-end and back-end

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd vibechatt
npm install

```

3.Set up the environment variables:

- Create a .env file in the server directory with the following variables:

```
PORT = 3000
JWT_KEY = "YOUR_JWT_SECRET"
ORIGIN = "http://localhost:5173"
DATABASE_URL = your_mongodb_connection_string
```

- create a .env file in the client directory(vibechatt) with the following variables:

```bash
VITE_SERVER_URL="YOUR_SERVER_URL"
#example: VITE_SERVER_URL="http://localhost:3000"
```

4.start the development server

- start front-end and back-end individually

```bash
# start backend server
cd server
nodemon server.js

# start front end server in a new terminal
cd vibechatt
npm run dev
```

- start client and server concurrently

```bash
#run both server and clien at once inside chatApp
npm install
npm run dev
```

### 🗺️ Features Incoming

- sending audio recordings

---

## 👨‍💻 Author

_Yash Shetye_

> Built with ❤️ to keep your conversations flowing in real time.
