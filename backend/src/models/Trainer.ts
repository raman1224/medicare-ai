// backend/src/models/Trainer.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ITrainer extends Document {
  userId: mongoose.Types.ObjectId;
  specialization: string[];
  certifications: {
    name: string;
    issuer: string;
    year: number;
    verified: boolean;
  }[];
  experience: number; // in years
  bio: string;
  hourlyRate: number;
  availability: {
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    slots: {
      start: string; // HH:mm format
      end: string;
    }[];
  }[];
  clients: mongoose.Types.ObjectId[];
  rating: number;
  totalReviews: number;
  verified: boolean;
  verificationDocuments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TrainerSchema = new Schema<ITrainer>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  specialization: [{
    type: String,
    required: true,
  }],
  certifications: [{
    name: { type: String, required: true },
    issuer: { type: String, required: true },
    year: { type: Number, required: true },
    verified: { type: Boolean, default: false },
  }],
  experience: {
    type: Number,
    required: true,
    min: 0,
  },
  bio: {
    type: String,
    required: true,
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0,
  },
  availability: [{
    day: { 
      type: String, 
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true,
    },
    slots: [{
      start: { type: String, required: true },
      end: { type: String, required: true },
    }],
  }],
  clients: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationDocuments: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

TrainerSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Trainer || 
  mongoose.model<ITrainer>('Trainer', TrainerSchema);