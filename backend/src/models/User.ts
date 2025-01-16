import { Schema, model, Document } from 'mongoose';

export enum UserRole {
  Admin = 'Admin',
  Leader = 'Leader',
  Employee = 'Employee'
}

export interface IUser extends Document {
  email: string;
  oktaId: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  oktaId: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update the updatedAt timestamp
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ oktaId: 1 });
userSchema.index({ role: 1 });

export const User = model<IUser>('User', userSchema);
