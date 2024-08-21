import { Router } from 'express';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import multer from 'multer';
import signup from '../controllers/AuthController/SignUpController.js';
import { login } from '../controllers/AuthController/LoginController.js';
import { logout } from '../controllers/AuthController/LogoutController.js';
import { getUserInfo } from '../controllers/AuthController/UserInfoController.js';
import {
  addProfileImage,
  removeProfileImage,
  updateProfile,
} from '../controllers/AuthController/ProfileController.js';

const authRoutes = Router();
const upload = multer({ dest: 'uploads/profiles/' });
authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.get('/user-info', verifyToken, getUserInfo);
authRoutes.post('/update-profile', verifyToken, updateProfile);
authRoutes.post(
  '/add-profile-image',
  verifyToken,
  (req, res, next) => {
    console.log('Request received');
    next();
  },
  upload.single('profile-image'),
  (req, res, next) => {
    console.log('File upload middleware triggered');
    next();
  },
  addProfileImage
);

authRoutes.delete('/remove-profile-image', verifyToken, removeProfileImage);
authRoutes.post('/logout', logout);
export default authRoutes;
