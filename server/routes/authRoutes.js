import {Router} from 'express'
import { signUp } from '../controller/controller.js';

const router = Router();


router.post("/signup",signUp)

export default router;