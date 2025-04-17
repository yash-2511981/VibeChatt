import { Router } from 'express'
import { verifyToken } from '../middleware/middleware.js';
import { createChannel} from '../controller/channelController.js';

const channelRoutes = Router()

channelRoutes.post("/create-channel",verifyToken,createChannel)


export default channelRoutes