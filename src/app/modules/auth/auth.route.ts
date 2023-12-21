import express from 'express';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constans';


const router = express.Router();

router.post(
  '/login',
  validateRequest(
    AuthValidation.loginValidationSchema,
  ),
  AuthController.loginUser,
);
router.post(
  '/change-password',
  auth(USER_ROLE.admin,USER_ROLE.student,USER_ROLE.faculty),
  validateRequest(
    AuthValidation.changePasswordValidationSchema,
  ),
  AuthController.changePassword,
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthController.refreshToken,
);



export const AuthRoutes = router;
