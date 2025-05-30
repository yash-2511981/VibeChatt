import Message from "../model/MessageModel.js";
import { mkdirSync, renameSync } from 'fs'

export const getMessages = async (req, res) => {
    try {

        const user1 = req.userId
        const user2 = req.body.id;

        if (!user1 || !user2) return res.status(400).send("both user required");

        const messages = await Message.find({
            $or: [
                { sender: user1, reciever: user2 },
                { sender: user2, reciever: user1 },
            ],
        }).sort({ timestamp: 1 })

        const now = Date.now();
        const EDIT_WINDOW = 3 * 60 * 1000;

        const msgWithEditFlag = messages.map((msg) => {
            if (msg.sender.toString() === user1.toString()) {
                const canEdit = now - msg.timestamp.getTime() < EDIT_WINDOW;
                return { ...msg.toObject(), canEdit }
            }
            return msg.toObject();
        })

        return res.status(200).json({ messages: msgWithEditFlag })
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
}


export const uploadFile = async (req, res) => {
    try {
        if (!req.file) return res.status(400).send("file is required");
        let date = Date.now();
        let fileDir = `uploads/files/${date}`;
        let filename = `${fileDir}/${req.file.originalname}`;

        mkdirSync(fileDir, { recursive: true });
        renameSync(req.file.path, filename);

        return res.status(200).json(filename)
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
}