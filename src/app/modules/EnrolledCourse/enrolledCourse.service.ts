/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { OfferedCourse } from '../OfferedCourse/OfferedCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import AppError from '../../errors/AppError';
import EnrolledCourse from './enrolledCourse.model';
import { Student } from '../student/student.model';
import mongoose from 'mongoose';

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  const { offeredCourse } = payload;

  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found !');
  }

  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new AppError(httpStatus.BAD_GATEWAY, 'Room is full !');
  }

  const student = await Student.findOne({ id: userId }, { _id: 1 });

  if (!student) {
    throw new AppError(httpStatus.NOT_FOUND, 'Student not found !');
  }
  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
    offeredCourse,
    student: student._id,
  });

  if (isStudentAlreadyEnrolled) {
    throw new AppError(httpStatus.CONFLICT, 'Student is already enrolled !');
  }
  // check mama - total credit --

  const enrolledCourses = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExists.semesterRegistration,
        student: student._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourseData',
      },
    },
    {
      $unwind: '$enrolledCourseData',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredit: { $sum: '$enrolledCourseData.credits' },
      },
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCredit: 1,
      },
    },
  ]);
  console.log(enrolledCourses);

const totalCredits = enrolledCourses.length > 0 ? enrolledCourses?.totalEnrolledCredit : 0

  // write hobe --
  // const session = await mongoose.startSession();

  // try {
  //   session.startTransaction();

  //   const result = await EnrolledCourse.create(
  //     [
  //       {
  //         semesterRegistration: isOfferedCourseExists.semesterRegistration,
  //         academicSemester: isOfferedCourseExists.academicSemester,
  //         academicFaculty: isOfferedCourseExists.academicFaculty,
  //         academicDepartment: isOfferedCourseExists.academicDepartment,
  //         offeredCourse: offeredCourse,
  //         course: isOfferedCourseExists.course,
  //         student: student._id,
  //         faculty: isOfferedCourseExists.faculty,
  //         isEnrolled: true,
  //       },
  //     ],
  //     { session },
  //   );

  //   if (!result) {
  //     throw new AppError(
  //       httpStatus.BAD_REQUEST,
  //       'Failed to enroll in this cousre !',
  //     );
  //   }

  //   const maxCapacity = isOfferedCourseExists.maxCapacity;
  //   await OfferedCourse.findByIdAndUpdate(offeredCourse, {
  //     maxCapacity: maxCapacity - 1,
  //   });

  //   await session.commitTransaction();
  //   await session.endSession();

  //   return result;
  // } catch (err: any) {
  //   await session.abortTransaction();
  //   await session.endSession();
  //   throw new Error(err);
  // }
};

const updateEnrolledCourseMarksIntoDB = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
};
