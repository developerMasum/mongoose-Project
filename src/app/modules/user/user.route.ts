import { UserValidation } from './user.validation';
import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { createAdminValidationSchema } from '../Admin/admin.validation';
import { createFacultyValidationSchema } from '../Faculty/faculty.validation';
import { createStudentValidationSchema } from './../student/student.validation';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constans';
import { upload } from '../../utils/sendImageToCLoudinary';

const router = express.Router();

router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  upload.single('file'),
  (req:Request,res:Response,next:NextFunction)=>{
req.body = JSON.parse(req.body.data)
next()
  },

  validateRequest(createStudentValidationSchema),
  UserControllers.createStudent,
);

router.post(
  '/create-faculty',
  validateRequest(createFacultyValidationSchema),
  UserControllers.createFaculty,
);
router.post(
  '/change-status/:id',
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserControllers.changeStatus,
);

router.post(
  '/create-admin',
  validateRequest(createAdminValidationSchema),
  UserControllers.createAdmin,
);
router.post(
  '/me',
  auth('student','faculty','admin'),
  UserControllers.getMe,
);

export const UserRoutes = router;
