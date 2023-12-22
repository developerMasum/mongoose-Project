import { z } from 'zod';

const loginValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'Id is require' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});
const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'Old password is require' }),
    newPassword: z.string({ required_error: 'Password is required' }),
  }),
});
const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: ' refresh token lagbe  amama' }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'ID is require' }),
  }),
});
const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({ required_error: 'ID  is require' }),
    newPassword:  z.string({ required_error: 'User password is require' })
  }),
});


export const AuthValidation = {
  loginValidationSchema,
  refreshTokenValidationSchema,
  changePasswordValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema
};

// http://localhost:3000/?id=A-0001&token=