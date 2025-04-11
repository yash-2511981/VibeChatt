import { compare } from 'bcrypt';
import User from '../model/UserModel.js'
import jwt from 'jsonwebtoken'

const validateTill = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: validateTill })
}

export const signUp = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).send("Email and Password is required");

        const user = await User.create({ email, password });

        res.cookie("jwt", createToken(email, user._id), {
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

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).send("Email and Password is required");

        const user = await User.findOne({ email });
        if (!user) return res.status(404).send("user is not found")

        const auth = await compare(password, user.password);

        if (!auth) return res.status(404).send("password is incorrect")

        res.cookie("jwt", createToken(email, user._id), {
            validateTill,
            secure: true,
            sameSite: "None"
        })

        res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                color: user.theme
            },
        })
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server Error");
    }
}


export const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) return res.status(400).send("user is not found");

        res.status(200).json({

            id: user.id,
            email: user.email,
            profileSetup: user.profileSetup,
            firstName: user.firstName,
            lastName: user.lastName,
            image: user.image,
            color: user.theme

        })
    } catch (error) {
        console.log({ error });
        return res.status(500).send("Internal Server Error");
    }
}