import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose, { mongo } from 'mongoose'
import router from './routes/authRoutes.js'
import contactsRoute from './routes/contactsRoutes.js'
import setupSocket from './socket.js'
import messageRoute from './routes/messagesRoutes.js'
import channelRoutes from './routes/channelRoutes.js'


dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseUrl = process.env.DATABASE_URL;


app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));

app.use("/uploads/profiles",express.static("uploads/profiles"))
app.use("/uploads/files",express.static("uploads/files"))

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", router)
app.use("/api/contacts", contactsRoute)
app.use("/api/messages", messageRoute)
app.use("/api/channel", channelRoutes)

const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})

setupSocket(server)

mongoose.connect(databaseUrl).then(() => {
    console.log("database is connected")
}).catch((err) => {
    console.log(err.message)
});
