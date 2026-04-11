
// frontend/src/lib/api/fitness.ts
import { api } from '../api';

export interface BMIRequest {
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female' | 'other';
}

export interface BMIResponse {
  bmi: number;
  category: string;
  suggestion: string;
}

export interface ActivityLog {
  steps?: number;
  exerciseTime?: number;
  caloriesBurned?: number;
  workouts?: {
    workoutId?: string;
    name: string;
    duration: number;
    calories: number;
    exercises?: any[];
  }[];
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  type: 'home' | 'gym';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  caloriesBurn: number;
  exercises: Exercise[];
  equipment?: string[];
  targetMuscles?: string[];
  thumbnail?: string;
}

export interface Exercise {
  name: string;
  description?: string;
  sets: number;
  reps: number | string;
  rest: number;
  video?: string;
  image?: string;
}

export const fitnessAPI = {
  // Profile
  getProfile: async () => {
    const response = await api.get('/fitness/profile');
    return response.data;
  },

  createProfile: async (data: any) => {
    const response = await api.post('/fitness/profile', data);
    return response.data;
  },

  // BMI Calculator
  calculateBMI: async (data: BMIRequest): Promise<BMIResponse> => {
    const response = await api.post('/fitness/bmi', data);
    return response.data as BMIResponse;
  },

  // Activity Tracking
  logActivity: async (data: ActivityLog) => {
    const response = await api.post('/fitness/activities', data);
    return response.data;
  },

  getTodayActivity: async () => {
    const response = await api.get('/fitness/activities/today');
    return response.data;
  },

  getProgressAnalytics: async (days: number = 30) => {
    const response = await api.get(`/fitness/analytics?days=${days}`);
    return response.data;
  },

  // Workouts
  getWorkoutSuggestions: async (params: { type?: string; goal?: string; level?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    const response = await api.get(`/fitness/workouts/suggestions?${query}`);
    return response.data;
  },

  completeWorkout: async (data: { workoutId?: string; workoutName: string; duration: number; calories: number; exercises?: any[] }) => {
    const response = await api.post('/fitness/workouts/complete', data);
    return response.data;
  },

  // Trainer
  getTrainers: async () => {
    const response = await api.get('/fitness/trainers');
    return response.data;
  },

  getTrainerProfile: async () => {
    const response = await api.get('/fitness/trainer/profile');
    return response.data;
  },

  createTrainerProfile: async (data: any) => {
    const response = await api.post('/fitness/trainer/profile', data);
    return response.data;
  },
};