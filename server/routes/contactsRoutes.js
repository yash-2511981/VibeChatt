import { Router } from 'express'
import { verifyToken } from '../middleware/middleware.js';
import { searchedContact } from '../controller/contactController.js';

const contactsRoute = Router()

contactsRoute.post("/search",verifyToken,searchedContact)


export default contactsRoute