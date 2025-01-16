import mongoose from 'mongoose';
import { APIError } from '../middleware/error';

export const toObjectId = (id: string): mongoose.Types.ObjectId => {
  try {
    return new mongoose.Types.ObjectId(id);
  } catch (error) {
    throw new APIError(400, 'Invalid ID format');
  }
};

export const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};
