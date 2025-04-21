# ViBeChat - Real-Time Chat App

## Overview

**ViBeChat** is a real-time chat application that enables seamless communication through direct messaging and group chats.  
Built with a powerful tech stack including **React, Node.js, Express, MongoDB, Socket.io**, and more, this application delivers a **responsive and intuitive user experience across all devices**.

---

### 🚀 Features

- **Real-Time Communication** – Instant messaging using Socket.io for both direct messages and group chats.
- **Media Sharing** – Support for sending images and file transfers with delivery tracking.
- **User Authentication** – Secure login system using JWT authentication.
- **Persistent Storage** – All messages are stored in MongoDB for complete conversation history.
- **Responsive Design** – Tailwind CSS implementation for a fully responsive UI on all devices.

### Tech Stack

- **Frontend**: React,Tailwind CSS,Zustand(state management)
- **Backend**: Node.js,Express
- **Database**: MongoDb
- **Real-time Communication** - Socket.io
- **Authentication** - JWT(Json Web Token)
- **File Handling** - Multer

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

- Voice and Video call functionality  
- Read receipts for messages  
- End-to-End encryption  
- Custom themes and UI personalization  

---

## 👨‍💻 Author

_Yash Shetye_

> Built with ❤️ to keep your conversations flowing in real time.

