import { Router } from 'express';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import {
  createGroup,
  editGroupInfo,
  getUserGroup,
} from '../controllers/GroupController.js';
const groupRoutes = Router();
groupRoutes.post('/create-group', verifyToken, createGroup);
groupRoutes.get('/get-user-group', verifyToken, getUserGroup);
groupRoutes.patch('/edit-group-info/:groupId', editGroupInfo);

export default groupRoutes;
