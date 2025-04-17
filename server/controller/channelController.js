import Channel from "../model/channelModel";
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
            membaers,
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