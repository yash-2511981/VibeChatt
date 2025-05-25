import mongoose from "mongoose";
import Channel from "../model/channelModel.js";
import User from "../model/UserModel.js";
import Message from "../model/MessageModel.js";

export const createChannel = async (req, res) => {
    try {
        const { name, members } = req.body;
        const userId = req.userId;

        const admin = await User.findById(userId);
        if (!admin) {
            return res.status(400).send("User not found");
        }

        const validMembers = await User.find({ _id: { $in: members } });
        if (validMembers.length !== members.length) {
            return res.status(400).send("Some members are not valid users");
        }

        const newChannel = new Channel({
            name,
            members,
            admin: userId
        });

        await newChannel.save();

        // Populate the required fields to match `getAllChannels` response format
        await newChannel.populate("members", "firstName lastName");
        await newChannel.populate("admin", "firstName lastName");
        await newChannel.populate({
            path: "messages",
            options: { sort: { timestamp: -1 }, limit: 1 }
        });

        const channelObj = newChannel.toObject();
        const lastMessage = channelObj.messages?.[0] || null;

        const formattedChannel = {
            ...channelObj,
            lastMessage: lastMessage
                ? {
                    ...lastMessage,
                    isOwnMessage: lastMessage.sender?.toString() === req.userId
                }
                : null,
            unseenCount: 0
        };

        res.status(200).json({ channel: formattedChannel });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server Error");
    }
};



export const getAllChannels = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);
        const data = await Channel.find({
            $or: [{ admin: userId }, { members: userId }],
        })
            .sort({ updatedAt: -1 })
            .populate("members", "firstName lastName")
            .populate("admin", "firstName lastName")

        const channels = await Promise.all(
            data.map(async (channel) => {
                const { messages, ...rest } = channel.toObject();

                const lastMessage = await Message.findOne({ _id: { $in: channel.messages } })
                    .sort({ timestamp: -1 }).populate("sender", "firstName lastName");

                return {
                    ...rest,
                    lastMessageTime: lastMessage?.timestamp ?? null,
                    lastMessage: lastMessage
                        ? {
                            _id: lastMessage._id,
                            sender: lastMessage.sender,
                            messageType: lastMessage.messageType,
                            content: lastMessage.content,
                            fileUrl: lastMessage.fileUrl || null,
                            timestamp: lastMessage.timestamp,
                            isOwnMessage: lastMessage.sender?.toString() === req.userId,
                        }
                        : null,
                    unseenCount: 0
                };
            })
        );

        channels.sort((a, b) => {
            if (!a.lastMessageTime) return 1;
            if (!b.lastMessageTime) return -1;
            return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
        });

        return res.status(200).json({ channels });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server Error");
    }
}



export const getChannelMsg = async (req, res) => {
    try {
        const { channelId } = req.params;

        const channel = await Channel.findById(channelId).populate({
            path: "messages",
            populate: {
                path: "sender",
                select: "firstName lastName email image _id color",
            }
        })

        if (!channel) return res.status(400).send("channel not found");

        const messages = channel.messages;
        return res.status(200).json({ messages });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server Error");
    }
}