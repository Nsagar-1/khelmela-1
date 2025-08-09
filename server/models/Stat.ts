import mongoose, { Schema, Document } from 'mongoose';

export interface IStat extends Document {
  id: number;
  label: string;
  value: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const StatSchema = new Schema<IStat>({
  label: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true,
    default: 0
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

export const Stat = mongoose.model<IStat>('Stat', StatSchema); 