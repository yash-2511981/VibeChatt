import {Router} from 'express'
import { login, signUp } from '../controller/controller.js';

const router = Router();


router.post("/signup",signUp)
router.post("/login",login)

export default router;