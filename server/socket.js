import { Socket, Server as SocketIoSever } from 'socket.io'

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

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
            console.log("User connected-" + userId + " socket id-" + socket.id)
        } else {
            console.log("userid not provided during connection");
        }

        socket.on("disconnect", () => disconnect(socket))

    })

}

export default setupSocket;
