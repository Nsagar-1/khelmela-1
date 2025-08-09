import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  description: string;
  user_id: string;
  user_name: string;
  image: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>({
  title: {
    type: String,
    required: true,
    trim: true 
  },
  description: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  user_name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: false,
    default: 'Games'
  }
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

export const Blog = mongoose.model<IBlog>('Blog', BlogSchema); 