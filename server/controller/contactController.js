import User from "../model/UserModel.js";

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

        return res.status(200).json({contacts})
    } catch (error) {
        console.log(error.message);
        return res.status(500).send("Internal Server Error");
    }
}