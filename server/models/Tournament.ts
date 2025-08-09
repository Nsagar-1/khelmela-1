import mongoose, { Schema, Document } from 'mongoose';

export interface ITournament extends Document {
  id: number;
  name: string;
  description: string;
  game: string;
  category: string;
  image: string;
  status: string;
  prizePool: number;
  teamSize: string;
  maxTeams: number;
  registeredTeams: number;
  startDate: Date;
  endDate: Date;
  organizer: string;
  entryFee: number;
  rules?: string;
  featured?: boolean;
  location?: string;
  bracket?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TournamentSchema = new Schema<ITournament>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  game: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['upcoming', 'live', 'completed', 'cancelled']
  },
  prizePool: {
    type: Number,
    required: true
  },
  teamSize: {
    type: String,
    required: true
  },
  maxTeams: {
    type: Number,
    required: true
  },
  registeredTeams: {
    type: Number,
    required: true,
    default: 0
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  organizer: {
    type: String,
    required: true
  },
  entryFee: {
    type: Number,
    required: true
  },
  rules: {
    type: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  location: {
    type: String
  },
  bracket: {
    type: String
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

export const Tournament = mongoose.model<ITournament>('Tournament', TournamentSchema); 