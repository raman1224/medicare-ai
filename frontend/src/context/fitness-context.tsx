// frontend/src/context/fitness-context.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { fitnessAPI } from '../lib/api/fitness';
import { toast } from 'react-hot-toast';

interface FitnessProfile {
  height?: number;
  weight?: number;
  bmi?: number;
  age?: number;
  gender?: string;
  goal?: string;
  fitnessLevel?: string;
  streak: number;
  achievements: string[];
}

interface Activity {
  steps: number;
  exerciseTime: number;
  caloriesBurned: number;
  workouts: any[];
  stepsProgress: number;
  caloriesProgress: number;
  timeProgress: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  isNew: boolean;
}

interface FitnessContextType {
  profile: FitnessProfile | null;
  todayActivity: Activity | null;
  achievements: Achievement[];
  loading: boolean;
  updateProfile: (data: Partial<FitnessProfile>) => Promise<void>;
  logActivity: (data: any) => Promise<void>;
  completeWorkout: (workout: any) => Promise<void>;
  refreshData: () => Promise<void>;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export function FitnessProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<FitnessProfile | null>(null);
  const [todayActivity, setTodayActivity] = useState<Activity | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      refreshData();
    }
  }, [session]);

  const refreshData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadProfile(),
        loadTodayActivity(),
      ]);
    } catch (error) {
      console.error('Error loading fitness data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async () => {
    try {
      const response = await fitnessAPI.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadTodayActivity = async () => {
    try {
      const response = await fitnessAPI.getTodayActivity();
      setTodayActivity(response.data);
    } catch (error) {
      console.error('Error loading today activity:', error);
    }
  };

  const updateProfile = async (data: Partial<FitnessProfile>) => {
    try {
      const response = await fitnessAPI.createProfile(data);
      setProfile(response.data);
      toast.success('Profile updated successfully!');
      
      // Check for achievements
      checkAchievements(response.data);
    } catch (error) {
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const logActivity = async (data: any) => {
    try {
      await fitnessAPI.logActivity(data);
      await loadTodayActivity();
      toast.success('Activity logged successfully!');
    } catch (error) {
      toast.error('Failed to log activity');
      throw error;
    }
  };

  const completeWorkout = async (workout: any) => {
    try {
      await fitnessAPI.completeWorkout({
        workoutId: workout.id,
        workoutName: workout.name,
        duration: workout.duration,
        calories: workout.caloriesBurn,
        exercises: workout.exercises,
      });
      
      await loadTodayActivity();
      
      // Trigger celebration
      const event = new CustomEvent('workoutComplete', { detail: workout });
      window.dispatchEvent(event);
      
      toast.success('Great job! Workout completed! 🎉');
    } catch (error) {
      toast.error('Failed to complete workout');
      throw error;
    }
  };

  const checkAchievements = (profile: FitnessProfile) => {
    const newAchievements: Achievement[] = [];

    if (profile.bmi && profile.bmi >= 18.5 && profile.bmi < 25) {
      newAchievements.push({
        id: 'healthy-bmi',
        title: 'Healthy BMI',
        description: 'You\'ve achieved a healthy BMI range!',
        isNew: true,
      });
    }

    if (profile.streak === 7) {
      newAchievements.push({
        id: 'week-streak',
        title: '7-Day Streak',
        description: 'You\'ve been active for 7 days in a row!',
        isNew: true,
      });
    }

    if (profile.streak === 30) {
      newAchievements.push({
        id: 'month-streak',
        title: '30-Day Streak',
        description: 'Amazing! A full month of consistency!',
        isNew: true,
      });
    }

    setAchievements(newAchievements);
  };

  return (
    <FitnessContext.Provider
      value={{
        profile,
        todayActivity,
        achievements,
        loading,
        updateProfile,
        logActivity,
        completeWorkout,
        refreshData,
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
}

export function useFitness() {
  const context = useContext(FitnessContext);
  if (context === undefined) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
}