import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  id: number;
  name: string;
  logo?: string;
  captain: string;
  players: string;
  tournamentId: number;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  logo: {
    type: String
  },
  captain: {
    type: String,
    required: true,
    trim: true
  },
  players: {
    type: String,
    required: true
  },
  tournamentId: {
    type: Number,
    required: true,
    ref: 'Tournament'
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

export const Team = mongoose.model<ITeam>('Team', TeamSchema); 