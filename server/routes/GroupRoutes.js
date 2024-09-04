import { Router } from 'express';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import {
  createGroup,
  editGroupInfo,
  getGroupMessages,
  getUserGroup,
} from '../controllers/GroupController.js';
const groupRoutes = Router();
groupRoutes.post('/create-group', verifyToken, createGroup);
groupRoutes.get('/get-user-group', verifyToken, getUserGroup);
groupRoutes.get('/get-group-messages/:groupId', verifyToken, getGroupMessages);
groupRoutes.patch('/edit-group-info/:groupId', editGroupInfo);

export default groupRoutes;
