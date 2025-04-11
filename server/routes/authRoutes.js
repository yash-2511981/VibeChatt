import {Router} from 'express'
import { getUserInfo, login, signUp } from '../controller/controller.js';
import { verifyToken } from '../middleware/middleware.js';

const router = Router();


router.post("/signup",signUp)
router.post("/login",login)
router.get("/user-info",verifyToken,getUserInfo)

export default router;