import { Router } from 'express'
import { verifyToken } from '../middleware/middleware.js';
import { getContactsDmList, searchedContact } from '../controller/contactController.js';

const contactsRoute = Router()

contactsRoute.post("/search",verifyToken,searchedContact)
contactsRoute.get("/get-all-contacts",verifyToken,getContactsDmList)


export default contactsRoute