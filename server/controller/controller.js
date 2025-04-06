import User from '../model/UserModel.js'
import jwt from 'jsonwebtoken'

const validateTill = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
    return jwt.sign((email, userId), process.env.JWT_KEY, { expiresIn: validateTill })
}

export const signUp = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).send("Email and Password is required");

        const user = await User.create({ email, password });

        res.cookie("jwt", createToken(email, user.id), {
            validateTill,
            secure: true,
            sameSite: "None"
        })

        res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup
            },
        })
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server Error");
    }
}