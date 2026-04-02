// backend/src/models/Workout.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkout extends Document {
  trainerId?: mongoose.Types.ObjectId;
  name: string;
  description: string;
  type: 'home' | 'gym' | 'custom';
  category: 'strength' | 'cardio' | 'flexibility' | 'hiit' | 'yoga';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  caloriesBurn: number;
  equipment: string[];
  targetMuscles: string[];
  exercises: {
    name: string;
    description?: string;
    sets: number;
    reps: number | string;
    rest: number; // in seconds
    video?: string;
    image?: string;
    equipment?: string[];
  }[];
  warmup?: {
    duration: number;
    exercises: string[];
  };
  cooldown?: {
    duration: number;
    exercises: string[];
  };
  thumbnail?: string;
  video?: string;
  isPublic: boolean;
  createdBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId[];
  tags: string[];
  likes: number;
  completedCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const WorkoutSchema = new Schema<IWorkout>({
  trainerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['home', 'gym', 'custom'],
    required: true,
  },
  category: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'hiit', 'yoga'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
  },
  caloriesBurn: {
    type: Number,
    required: true,
    min: 0,
  },
  equipment: [{
    type: String,
  }],
  targetMuscles: [{
    type: String,
  }],
  exercises: [{
    name: { type: String, required: true },
    description: String,
    sets: { type: Number, required: true, min: 1 },
    reps: { type: Schema.Types.Mixed, required: true },
    rest: { type: Number, required: true, min: 0 },
    video: String,
    image: String,
    equipment: [String],
  }],
  warmup: {
    duration: { type: Number, min: 0 },
    exercises: [String],
  },
  cooldown: {
    duration: { type: Number, min: 0 },
    exercises: [String],
  },
  thumbnail: String,
  video: String,
  isPublic: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedTo: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  tags: [String],
  likes: {
    type: Number,
    default: 0,
  },
  completedCount: {
    type: Number,
    default: 0,
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

WorkoutSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Workout || 
  mongoose.model<IWorkout>('Workout', WorkoutSchema);