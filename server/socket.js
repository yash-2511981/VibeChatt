import { Socket, Server as SocketIoSever } from 'socket.io'
import Message from './model/MessageModel.js';

const setupSocket = (server) => {
    const io = new SocketIoSever(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true
        },
    });

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`client disconnect ${socket.id}`);

        for (const [userId, soketId] of userSocketMap.entries()) {
            if (soketId === socket.id) {
                userSocketMap.delete(userId);
            }
        }
    }


    const sendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender)
        const recieverSocketId = userSocketMap.get(message.reciever)

        const createdMessage = await Message.create(message);

        const messageData = await Message.findById(createdMessage._id).
        populate("sender","id email firstName lastName image theme")
        .populate("reciever","id email firstName lastName image theme");


        [senderSocketId, recieverSocketId].forEach(socketId => {
            if (socketId) {
                io.to(socketId).emit("recieveMessage", messageData);
            }
        });
    }

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            // console.log("User connected-" + userId + " socket id-" + socket.id)
        } else {
            console.log("userid not provided during connection");
        }

        socket.on("sendMessage", sendMessage)
        socket.on("disconnect", () => disconnect(socket))

    })

}

export default setupSocket;
