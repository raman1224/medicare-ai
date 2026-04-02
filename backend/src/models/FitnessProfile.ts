// backend/src/models/FitnessProfile.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IFitnessProfile extends Document {
  userId: mongoose.Types.ObjectId;
  height?: number;
  weight?: number;
  bmi?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  goal?: 'weightLoss' | 'muscleGain' | 'maintenance' | 'general';
  fitnessLevel?: 'beginner' | 'intermediate' | 'advanced';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  medicalConditions?: string[];
  injuries?: string[];
  streak: number;
  lastActive: Date;
  achievements: string[];
  preferences: {
    workoutReminders: boolean;
    nutritionReminders: boolean;
    shareProgress: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const FitnessProfileSchema = new Schema<IFitnessProfile>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  height: {
    type: Number,
    min: 50,
    max: 250,
  },
  weight: {
    type: Number,
    min: 20,
    max: 300,
  },
  bmi: {
    type: Number,
    min: 10,
    max: 50,
  },
  age: {
    type: Number,
    min: 1,
    max: 120,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  goal: {
    type: String,
    enum: ['weightLoss', 'muscleGain', 'maintenance', 'general'],
    default: 'general',
  },
  fitnessLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'active', 'veryActive'],
    default: 'sedentary',
  },
  medicalConditions: [{
    type: String,
  }],
  injuries: [{
    type: String,
  }],
  streak: {
    type: Number,
    default: 0,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
  achievements: [{
    type: String,
  }],
  preferences: {
    workoutReminders: { type: Boolean, default: true },
    nutritionReminders: { type: Boolean, default: true },
    shareProgress: { type: Boolean, default: false },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

FitnessProfileSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.FitnessProfile || 
  mongoose.model<IFitnessProfile>('FitnessProfile', FitnessProfileSchema);