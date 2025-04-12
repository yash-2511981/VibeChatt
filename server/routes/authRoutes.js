import {Router} from 'express'
import { getUserInfo, login, signUp, updateProfile } from '../controller/controller.js';
import { verifyToken } from '../middleware/middleware.js';

const router = Router();


router.post("/signup",signUp)
router.post("/login",login)
router.get("/user-info",verifyToken,getUserInfo)
router.post("/update-profile",verifyToken,updateProfile)

export default router;