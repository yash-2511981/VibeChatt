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



export const getContactsDmList = async (req, res, next) => {
    try {
        let userId = req.userId;

        userId = new mongoose.Types.ObjectId(userId);

        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { reciever: userId }],
                },
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender",userId] },
                            then: "$reciever",
                            else: "$sender"
                        }
                    },
                    lastMessageTime: { $first: "$timestamp" }
                }
            },
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
            {
                $project: {
                    id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                    theme: "$contactInfo.theme"
                }
            },
            {
                $sort:{lastMessageTime:-1}
            }
        ])

        return res.status(200).json({ contacts })
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error");
    }
}