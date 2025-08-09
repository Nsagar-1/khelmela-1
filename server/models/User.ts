import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  id: number;
  username: string;
  email: string;
  password: string;
  admin: string;
  profilePhoto: string; // Optional field for profile photo
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  admin: {
    type: String,
    default: 'user',
  }, 
  profilePhoto: {
    type: String,  },
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

export const User = mongoose.model<IUser>('User', UserSchema); 