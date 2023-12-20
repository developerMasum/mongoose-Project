/* eslint-disable no-unused-vars */
import { Model } from "mongoose";
import { USER_ROLE } from "./user.constans";

export interface TUser  {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt ?: Date;
  role: 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
};

export interface UserModel extends Model<TUser>{

isUserExistsByCustomId(id:string):Promise<TUser>
isPasswordMatch(plainTextPassword:string,hashedPassword:string):Promise<boolean>
}

export type TUser_Role = keyof typeof USER_ROLE;