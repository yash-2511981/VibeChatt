import { Server as SocketIoServer } from 'socket.io';
import Message from './model/MessageModel.js';
import User from './model/UserModel.js';
import Channel from './model/channelModel.js';

const setupSocket = (server) => {
    const io = new SocketIoServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true
        },
    });

    const userSocketMap = new Map();
    const activeCallMap = new Map();

    const disconnect = async (socket) => {
        // Find user who disconnected
        let disconnectedUserId = null;
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                const updatedUser = await User.findByIdAndUpdate(userId, { status: 'offline', lastActive: new Date() }, { new: true });
                disconnectedUserId = userId;
                userSocketMap.delete(userId);
                socket.broadcast.emit("contact-update", {
                    _id: updatedUser._id,
                    email: updatedUser.email,
                    theme: 0,
                    profileSetup: true,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    image: updatedUser.image,
                    status: updatedUser.status,
                    lastActive: updatedUser.lastActive
                })
                break;
            }
        }

        // If user was in a call, notify the other party
        if (disconnectedUserId && activeCallMap.has(disconnectedUserId)) {
            const callInfo = activeCallMap.get(disconnectedUserId);
            const otherPartySocketId = userSocketMap.get(callInfo.peerId);

            if (otherPartySocketId) {
                io.to(otherPartySocketId).emit("callEnded", {
                    message: "Call ended because user disconnected"
                });
            }

            activeCallMap.delete(disconnectedUserId);
            activeCallMap.delete(callInfo.peerId);
        }
    };

    const sendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const recieverSocketId = userSocketMap.get(message.reciever);


        const newMessage = recieverSocketId ? { ...message, status: "recieved" } : message

        const createdMessage = await Message.create(newMessage);

        const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email firstName lastName image theme")
            .populate("reciever", "id email firstName lastName image theme ");

        [senderSocketId, recieverSocketId].forEach(socketId => {
            if (senderSocketId) {
                io.to(socketId).emit("recieveMessage", messageData);
            }
        });
    };

    const sendChannelMsg = async (message) => {
        const { channelId, sender, content, messageType, fileUrl } = message;

        const createMsg = await Message.create({
            sender,
            reciever: null,
            content,
            messageType,
            timestamp: new Date(),
            fileUrl
        });

        const messageData = await Message.findById(createMsg._id)
            .populate("sender", "id email firstName lastName image theme")
            .exec();

        await Channel.findByIdAndUpdate(channelId, {
            $push: { messages: createMsg._id }
        });

        const channel = await Channel.findById(channelId).populate("members");

        const finaldata = { ...messageData._doc, channelId: channel._id };

        if (channel && channel.members) {
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString());

                if (memberSocketId) {
                    io.to(memberSocketId).emit("recieve-channel-message", finaldata);
                }
            });

            const adminSocketId = userSocketMap.get(channel.admin._id.toString());
            if (adminSocketId) {
                io.to(adminSocketId).emit("recieve-channel-message", finaldata);
            }
        }
    };

    const outGoingCall = async (data) => {
        const { from, to } = data;
        const calleesocketId = userSocketMap.get(to.id);
        const callersocketId = userSocketMap.get(from.id);
        if (calleesocketId) {
            io.to(calleesocketId).emit("incomingCall", data);
        } else {
            io.to(callersocketId).emit("callEnded", {
                message: "Call ended because user disconnected"
            });
        }
    };

    const callAccepted = async (data) => {
        const { to, from } = data;
        const callerSocketId = userSocketMap.get(to);

        if (callerSocketId) {
            // Update call mapping for the receiver
            if (activeCallMap.has(to)) {
                activeCallMap.set(from, {
                    callType: activeCallMap.get(to).callType,
                    peerId: to
                });
            }

            // Forward acceptance to caller
            io.to(callerSocketId).emit("callAccepted", {
                answer: data.answer
            });
        }
    };

    const callRejected = async (data) => {
        const { to } = data;
        const callerSocketId = userSocketMap.get(to);

        if (callerSocketId) {
            // Clean up call mappings
            activeCallMap.delete(to);

            // Notify caller of rejection
            io.to(callerSocketId).emit("call-rejected", {
                reason: "Call was rejected"
            });
        }
    };

    const sendIceCandidate = async (socket, data) => {
        const { to, candidate } = data;

        const toSocketId = userSocketMap.get(to);
        if (toSocketId) {
            // Send the candidate directly, not in an object
            io.to(toSocketId).emit("ice-candidate", candidate);
        }
    };

    // Handle sending offers
    const sendOffer = async (socket, data) => {
        const { to, offer } = data;

        const toSocketId = userSocketMap.get(to);
        if (toSocketId) {
            // Send the offer directly, not in an object
            io.to(toSocketId).emit("offer", offer);
        }
    };

    // Handle sending answers
    const sendAnswer = async (socket, data) => {
        const { to, answer } = data;

        const toSocketId = userSocketMap.get(to);
        if (toSocketId) {
            // Make sure the event name matches the client listener (ans)
            io.to(toSocketId).emit("ans", answer);
        }
    };

    io.on("connection", async (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            const updatedUser = await User.findByIdAndUpdate(userId, { status: "online" }, { new: true })
            userSocketMap.set(userId, socket.id);
            socket.broadcast.emit("contact-update", {
                _id: updatedUser._id,
                email: updatedUser.email,
                theme: 0,
                profileSetup: true,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                image: updatedUser.image,
                status: updatedUser.status,
                lastActive: updatedUser.lastActive
            })
        }

        socket.on("sendMessage", sendMessage);
        socket.on("send-channel-msg", sendChannelMsg);
        socket.on("disconnect", (u) => disconnect(socket));

        socket.on("outgoingCall", outGoingCall);
        socket.on("call-accepted", callAccepted);
        socket.on("call-rejected", callRejected);

        //setting up rtc connection
        socket.on("ice-candidate", (data) => {
            sendIceCandidate(socket, data);
        });

        socket.on("offer", (data) => {
            sendOffer(socket, data);
        });

        socket.on("answer", (data) => {
            sendAnswer(socket, data);
        });

        // Handle ICE candidates
        socket.on('iceCandidate', ({ to, from, candidate }) => {
            const receiverSocketId = userSocketMap.get(to);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('iceCandidate', {
                    from,
                    candidate
                });
            }
        });
    });
};

export default setupSocket;