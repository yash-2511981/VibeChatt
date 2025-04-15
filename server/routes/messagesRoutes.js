import {Router} from 'express'
import {getMessages} from '../controller/messagesController.js';
import { verifyToken } from '../middleware/middleware.js';


const messageRoute = Router();

messageRoute.post("/get-messages",verifyToken,getMessages);

export default messageRoute;