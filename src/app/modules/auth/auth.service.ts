import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config';

const loginUser = async (payload: TLoginUser) => {
    const user = await User.isUserExistsByCustomId(payload?.id)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'this user not founded !');
  }

  // checking if the user exists
  //     const isUserExists = await User.findOne({ id: payload?.id });
  //     if (!isUserExists) {
  //         throw new AppError(httpStatus.NOT_FOUND, 'this user not founded !');
  //     }

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

  // access to login (pass check)

  const isPasswordMatched = await bcrypt.compare(payload?.password,user?.password)
      console.log(isPasswordMatched);



    if (!await User?.isPasswordMatch(payload.password,user?.password)) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password doesnot matched !');
    }

// create token and sent to client

const jwtPayload = {
  userId:user?.id,
  role: user?.role


}

const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, { expiresIn: '10d' });




  return {
    accessToken,
    needsPasswordChange:user?.needsPasswordChange
  };
};

export const AuthServices = {
  loginUser,
};
