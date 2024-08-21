import { Router } from 'express';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import {
  getChatContactsList,
  SearchContacts,
} from '../controllers/ContactController/SearchContactsController.js';

const contactsRoutes = Router();
contactsRoutes.post('/search', verifyToken, SearchContacts);
contactsRoutes.get('/get-chat-contacts', verifyToken, getChatContactsList);

export default contactsRoutes;
