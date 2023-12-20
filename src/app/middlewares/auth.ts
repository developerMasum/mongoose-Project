import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';

const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    //client side authorization
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED,'You are not Authorized !!')
    }
next();
  });
};

export default auth;
