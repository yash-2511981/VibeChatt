
import jwt from 'jsonwebtoken'

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) return res.status(401).send("your are not authenticated");

    jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
        if (err) {
            return res.status(401).send("token is not valid")
            console.log(err)
        }
        req.userId = payload.userId
        next()
    })
}