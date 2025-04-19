import { Router } from 'express'
import { verifyToken } from '../middleware/middleware.js';
import { createChannel, getAllChannels} from '../controller/channelController.js';

const channelRoutes = Router()

channelRoutes.post("/create-channel",verifyToken,createChannel)
channelRoutes.get("/get-user-channel",verifyToken,getAllChannels)


export default channelRoutes