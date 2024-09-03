import { Router } from 'express';
import {
  getMessages,
  UnsendMessages,
  uploadFile,
} from '../controllers/ContactController/MessagesController.js';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import multer from 'multer';
const messagesRoutes = Router();
const upload = multer({ dest: 'uploads/files' });
messagesRoutes.post('/get-messages', verifyToken, getMessages);
messagesRoutes.post(
  '/upload-file',
  verifyToken,
  upload.single('file'),
  uploadFile
);
messagesRoutes.delete(
  '/unsend-messages/:messageId',
  verifyToken,
  UnsendMessages
);

export default messagesRoutes;
