import { Router } from 'express'
import { getMessages, uploadFile } from '../controller/messagesController.js';
import { verifyToken } from '../middleware/middleware.js';
import multer from 'multer'

const messageRoute = Router();
const upload = multer({ dest: "uploads/files/" })

messageRoute.post("/get-messages", verifyToken, getMessages);
messageRoute.post("/send-file", verifyToken, upload.single("file",), uploadFile);

export default messageRoute;