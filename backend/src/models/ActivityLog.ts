// backend/src/models/ActivityLog.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId;
  steps: number;
  exerciseTime: number; // in minutes
  caloriesBurned: number;
  caloriesIntake?: number;
  waterIntake?: number; // in ml
  sleep?: {
    duration: number; // in minutes
    quality?: 'poor' | 'fair' | 'good' | 'excellent';
  };
  workouts: {
    workoutId?: mongoose.Types.ObjectId;
    name: string;
    duration: number;
    calories: number;
    completedAt: Date;
    exercises?: {
      name: string;
      sets: number;
      reps: number;
      weight?: number;
    }[];
  }[];
  mood?: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  notes?: string;
  date: Date;
  createdAt: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  steps: {
    type: Number,
    default: 0,
    min: 0,
  },
  exerciseTime: {
    type: Number,
    default: 0,
    min: 0,
  },
  caloriesBurned: {
    type: Number,
    default: 0,
    min: 0,
  },
  caloriesIntake: {
    type: Number,
    min: 0,
  },
  waterIntake: {
    type: Number,
    min: 0,
  },
  sleep: {
    duration: { type: Number, min: 0 },
    quality: { type: String, enum: ['poor', 'fair', 'good', 'excellent'] },
  },
  workouts: [{
    workoutId: { type: Schema.Types.ObjectId, ref: 'Workout' },
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    calories: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now },
    exercises: [{
      name: String,
      sets: Number,
      reps: Number,
      weight: Number,
    }],
  }],
  mood: {
    type: String,
    enum: ['great', 'good', 'okay', 'bad', 'terrible'],
  },
  notes: String,
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index for efficient queries
ActivityLogSchema.index({ userId: 1, date: -1 });
ActivityLogSchema.index({ userId: 1, 'workouts.completedAt': -1 });

export default mongoose.models.ActivityLog || 
  mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);