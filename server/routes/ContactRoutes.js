import { Router } from 'express';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import {
  getAllContacts,
  getChatContactsList,
  SearchContacts,
  SearchGroupContacts,
} from '../controllers/ContactController/SearchContactsController.js';

const contactsRoutes = Router();
contactsRoutes.post('/search', verifyToken, SearchContacts);
contactsRoutes.post('/search-contacts', verifyToken, SearchGroupContacts);
contactsRoutes.get('/get-chat-contacts', verifyToken, getChatContactsList);
contactsRoutes.get('/get-all-contacts', verifyToken, getAllContacts);

export default contactsRoutes;
