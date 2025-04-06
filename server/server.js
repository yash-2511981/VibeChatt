import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose, { mongo } from 'mongoose'
import router from './routes/authRoutes.js'


dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseUrl = process.env.DATABASE_URL;


app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use("/auth",router)

const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})

app.get("/", (req, res) => {
    res.send("hello")
})

mongoose.connect(databaseUrl).then(() => {
    console.log("database is connected")
}).catch((err) => {
    console.log(err.message)
});
