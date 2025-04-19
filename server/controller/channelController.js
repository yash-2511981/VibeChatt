import mongoose from "mongoose";
import Channel from "../model/channelModel.js";
import User from "../model/UserModel.js";

export const createChannel = async (req, res) => {
    try {
        const { name, members } = req.body;

        const userId = req.userId

        const admin = await User.findById(userId);

        if (!admin) {
            return res.status(400).send("user not found");
        }

        const validMembers = await User.find({ _id: { $in: members } });

        if (validMembers.length !== members.length) {
            return res.status(400).send("some members are not valid users")
        }
        const newChannel = new Channel({
            name,
            members,
            admin: userId
        })

        await newChannel.save();

        res.status(200).json({
            channel: newChannel
        });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server Error");
    }
}


export const getAllChannels = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);
        const channels = await Channel.find({
            $or: [{ admin: userId }, { members: userId }],
        }).sort({ updatedAt: -1 })


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

        if(!channel) return res.status(400).send("channel not found");

        const messages = channel.messages;
        return res.status(200).json({ messages });
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server Error");
    }
}