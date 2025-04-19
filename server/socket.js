import { Socket, Server as SocketIoSever } from 'socket.io'
import Message from './model/MessageModel.js';
import Channel from './model/channelModel.js';

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
            populate("sender", "id email firstName lastName image theme")
            .populate("reciever", "id email firstName lastName image theme");


        [senderSocketId, recieverSocketId].forEach(socketId => {
            if (socketId) {
                io.to(socketId).emit("recieveMessage", messageData);
            }
        });
    }

    const sendChannelMsg = async (message) => {
        const { channelId, sender, content, messageType, fileUrl } = message;
        
        const createMsg = await Message.create({
            sender,
            reciever: null,
            content,
            messageType,
            timestamp: new Date(),
            fileUrl
        })
        
        const messageData = await Message.findById(createMsg._id).populate("sender", "id email firstName lastName image theme").exec()
        
        await Channel.findByIdAndUpdate(channelId, {
            $push: { messages: createMsg._id }
        });
        
        const channel = await Channel.findById(channelId).populate("members");
        
        const finaldata = { ...messageData._doc, channelId: channel._id };
        
        if (channel && channel.members) {
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString())
                
                if (memberSocketId) {
                    io.to(memberSocketId).emit("recieve-channel-message", finaldata)
                }
            });
            
            const adminSocketId = userSocketMap.get(channel.admin._id.toString())
            if (adminSocketId) {
                io.to(adminSocketId).emit("recieve-channel-message", finaldata)
            }
        }
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
        socket.on("send-channel-msg", sendChannelMsg)
        socket.on("disconnect", () => disconnect(socket))

    })

}

export default setupSocket;
