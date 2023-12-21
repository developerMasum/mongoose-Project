import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUser } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const auth = (...requiredRoles: TUser[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    //client side authorization
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not Authorized !!');
    }

    //check validate token
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string) as JwtPayload
      

        const {role,userId,iat} = decoded ;
     


        const user = await User.isUserExistsByCustomId(userId);
        if (!user) {
          throw new AppError(httpStatus.NOT_FOUND, 'this user not founded !');
        }
      

      
        // check the user is already deleted
        const isDeleted = user?.isDeleted;
        if (isDeleted) {
          throw new AppError(httpStatus.FORBIDDEN, 'this user is deleted !');
        }
      
        // blocked
      
        const userStatus = user?.status;
        if (userStatus === 'blocked') {
          throw new AppError(httpStatus.FORBIDDEN, 'this user is blocked !');
        }
      
if (user.passwordChangedAt &&User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt,iat as number)) {
  throw new AppError(
    httpStatus.UNAUTHORIZED,
    'You are not Authorized !!',
  );
}

      
        if (requiredRoles && !requiredRoles.includes(role)) {
          throw new AppError(
            httpStatus.UNAUTHORIZED,
            'You are not Authorized !!',
          );
        }

        //decode ar khelaa
        req.user = decoded as JwtPayload;

        next();
    
  });
};

export default auth;
