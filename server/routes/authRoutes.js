import {Router} from 'express'
import { getUserInfo, login, setProfileImage, signUp, updateProfile,removeProfileImage, logout } from '../controller/controller.js';
import { verifyToken } from '../middleware/middleware.js';
import multer from 'multer'


const router = Router();
const upload = multer({dest:"uploads/profiles/"})


router.post("/signup",signUp)
router.post("/login",login)
router.post("/logout",logout)
router.get("/user-info",verifyToken,getUserInfo)
router.post("/update-profile",verifyToken,updateProfile)
router.post("/set-profile-image",verifyToken,upload.single("profile-image"),setProfileImage);
router.delete("/remove-profile-image",verifyToken,removeProfileImage)
export default router;