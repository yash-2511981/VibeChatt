import mongoose from "mongoose";
import User from "../model/UserModel.js";
import Message from "../model/MessageModel.js";

export const searchedContact = async (req, res, next) => {
    try {

        const { value } = req.body

        if (value === undefined || value === null) {
            return res.status(400).send("searchedContact is required")
        }

        const sanitizevalue = value.replace(
            /[.*+?^${}|[\]\\]/g,
            "\\$&"
        );

        const regex = new RegExp(sanitizevalue, "i");

        const contacts = await User.find({
            $and: [{ _id: { $ne: req.userId } },
            {
                $or: [{ firstName: regex }, { lastName: regex }, { email: regex }]
            },
            ],
        });

        return res.status(200).json({ contacts })
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
}

export const getAllContacts = async (req, res, next) => {
    try {

        const users = await User.find(
            { _id: { $ne: req.userId } },
            "firstName lastName _id email"
        );

        const contacts = users.map((user) =>
        ({
            label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
            value: user._id
        })
        );

        return res.status(200).json({ contacts })
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
}

export const getContactsDmList = async (req, res, next) => {
    try {
        let userId = req.userId;
        userId = new mongoose.Types.ObjectId(userId);

        // First: Get all contacts with their last message
        const contacts = await Message.aggregate([
            // Match messages where the current user is either sender or receiver
            {
                $match: {
                    $or: [{ sender: userId }, { reciever: userId }],
                }
            },
            // Sort by timestamp in descending order to get most recent messages first
            {
                $sort: { timestamp: -1 }
            },
            // Group by conversation partner 
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$reciever",
                            else: "$sender"
                        }
                    },
                    lastMessage: { $first: "$$ROOT" },
                    lastMessageTime: { $first: "$timestamp" }
                }
            },
            // Get information about the contact
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo"
                }
            },
            {
                $unwind: "$contactInfo"
            },
            // Get count of unseen messages from this contact
            {
                $lookup: {
                    from: "messages",
                    let: { contactId: "$_id", currentUser: userId },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$sender", "$$contactId"] },
                                        { $eq: ["$reciever", "$$currentUser"] },
                                        { $ne: ["$status", "seen"] }
                                    ]
                                }
                            }
                        },
                        {
                            $count: "unseenCount"
                        }
                    ],
                    as: "unseenMessages"
                }
            },
            // Process the unseen messages result
            {
                $addFields: {
                    unseenCount: {
                        $cond: {
                            if: { $gt: [{ $size: "$unseenMessages" }, 0] },
                            then: { $arrayElemAt: ["$unseenMessages.unseenCount", 0] },
                            else: 0
                        }
                    }
                }
            },
            // Format the final output - KEEPING _id field
            {
                $project: {
                    _id: 1, // Keep the _id field as is
                    lastMessageTime: 1,
                    unseenCount: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    fullName: {
                        $concat: ["$contactInfo.firstName", " ", "$contactInfo.lastName"]
                    },
                    image: "$contactInfo.image",
                    theme: "$contactInfo.theme",
                    status: "$contactInfo.status",
                    lastActive: "$contactInfo.lastActive",
                    // Last message details
                    lastMessage: {
                        content: "$lastMessage.content",
                        timestamp: "$lastMessage.timestamp",
                        status: "$lastMessage.status",
                        type: "$lastMessage.type",
                        isOwnMessage: { $eq: ["$lastMessage.sender", userId] }
                    }
                }
            },
            // Sort by last message time
            {
                $sort: { lastMessageTime: -1 }
            }
        ]);

        return res.status(200).json({ contacts });
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}