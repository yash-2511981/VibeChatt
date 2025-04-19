import { Router } from 'express'
import { verifyToken } from '../middleware/middleware.js';
import { createChannel, getAllChannels, getChannelMsg} from '../controller/channelController.js';

const channelRoutes = Router()

channelRoutes.post("/create-channel",verifyToken,createChannel)
channelRoutes.get("/get-user-channel",verifyToken,getAllChannels)
channelRoutes.get("/get-channel-messages/:channelId",verifyToken,getChannelMsg)


export default channelRoutes