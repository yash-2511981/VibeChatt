# ViBeChat - Real-Time Chat App

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

### Tech Stack

- **Frontend**: React,Tailwind CSS,Zustand(state management)
- **Backend**: Node.js,Express
- **Database**: MongoDb
- **Real-time Communication** - Socket.io
- **Authentication** - JWT(Json Web Token)
- **File Handling** - Multer
- **Video and Audio Call** - webRTC api

### Installation :-

1.Clone the repository

```bash
git clone https://github.com/yash-2511981/ChatApp.git
cd ChatApp
```

2.Install depedencies for both front-end and back-end

```bash
#Install backend dependecies
cd server
npm install

#Install frontend dependencies
cd server
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
cd client
npm run dev
```

- start client and server concurrently

```bash
#run both server and clien at once inside chatApp
npm install
npm run dev
```

### 🗺️ Roadmap

- sending audio recordings

---

## 👨‍💻 Author

_Yash Shetye_

> Built with ❤️ to keep your conversations flowing in real time.
