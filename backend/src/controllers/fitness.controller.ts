// // backend/src/controllers/fitness.controller.ts
// import { Request, Response } from 'express';
// import FitnessProfile from '../models/FitnessProfile';
// import ActivityLog from '../models/ActivityLog';
// import Workout from '../models/Workout';
// import Trainer from '../models/Trainer';
// import { calculateBMI, getBMICategory } from '../utils/fitness.utils';
// import { generateWorkoutSuggestions } from '../services/ai.service';

// export const createFitnessProfile = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user._id;
//     const profileData = req.body;

//     // Calculate BMI if height and weight provided
//     if (profileData.height && profileData.weight) {
//       const heightInMeters = profileData.height / 100;
//       profileData.bmi = calculateBMI(profileData.weight, heightInMeters);
//     }

//     const profile = await FitnessProfile.findOneAndUpdate(
//       { userId },
//       { ...profileData, updatedAt: new Date() },
//       { upsert: true, new: true }
//     );

//     res.status(201).json({
//       success: true,
//       message: 'Fitness profile created successfully',
//       data: profile,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error creating fitness profile',
//       error: error.message,
//     });
//   }
// };

// export const getFitnessProfile = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user._id;
    
//     const profile = await FitnessProfile.findOne({ userId })
//       .populate('userId', 'name email avatar');

//     if (!profile) {
//       return res.status(404).json({
//         success: false,
//         message: 'Fitness profile not found',
//       });
//     }

//     res.json({
//       success: true,
//       data: profile,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching fitness profile',
//       error: error.message,
//     });
//   }
// };

// export const calculateBMIEndpoint = async (req: Request, res: Response) => {
//   try {
//     const { height, weight, age, gender } = req.body;
//     const userId = req.user._id;

//     if (!height || !weight || !age || !gender) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing required fields',
//       });
//     }

//     const heightInMeters = height / 100;
//     const bmi = calculateBMI(weight, heightInMeters);
//     const category = getBMICategory(bmi);

//     // Update or create fitness profile
//     await FitnessProfile.findOneAndUpdate(
//       { userId },
//       { height, weight, bmi, age, gender, updatedAt: new Date() },
//       { upsert: true }
//     );

//     res.json({
//       success: true,
//       data: {
//         bmi,
//         category: category.category,
//         suggestion: category.suggestion,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error calculating BMI',
//       error: error.message,
//     });
//   }
// };

// export const logActivity = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user._id;
//     const activityData = req.body;

//     // Set date to beginning of day for grouping
//     const date = new Date();
//     date.setHours(0, 0, 0, 0);

//     // Find or create today's activity log
//     let activityLog = await ActivityLog.findOne({ userId, date });

//     if (activityLog) {
//       // Update existing log
//       activityLog.steps += activityData.steps || 0;
//       activityLog.exerciseTime += activityData.exerciseTime || 0;
//       activityLog.caloriesBurned += activityData.caloriesBurned || 0;
//       if (activityData.workouts) {
//         activityLog.workouts.push(...activityData.workouts);
//       }
//       await activityLog.save();
//     } else {
//       // Create new log
//       activityLog = await ActivityLog.create({
//         userId,
//         ...activityData,
//         date,
//       });
//     }

//     // Update streak
//     await updateUserStreak(userId);

//     res.status(201).json({
//       success: true,
//       message: 'Activity logged successfully',
//       data: activityLog,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error logging activity',
//       error: error.message,
//     });
//   }
// };

// export const getTodayActivity = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user._id;
//     const date = new Date();
//     date.setHours(0, 0, 0, 0);

//     const activity = await ActivityLog.findOne({ userId, date });

//     // Calculate progress percentages
//     const profile = await FitnessProfile.findOne({ userId });
//     const stepsTarget = 10000; // Default target
//     const caloriesTarget = profile?.goal === 'weightLoss' ? 500 : 400;
//     const timeTarget = 60; // 60 minutes

//     const response = {
//       ...activity?.toObject() || { steps: 0, exerciseTime: 0, caloriesBurned: 0, workouts: [] },
//       stepsProgress: activity ? (activity.steps / stepsTarget) * 100 : 0,
//       caloriesProgress: activity ? (activity.caloriesBurned / caloriesTarget) * 100 : 0,
//       timeProgress: activity ? (activity.exerciseTime / timeTarget) * 100 : 0,
//     };

//     res.json({
//       success: true,
//       data: response,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching today\'s activity',
//       error: error.message,
//     });
//   }
// };

// export const getWorkoutSuggestions = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user._id;
//     const { type = 'home', goal, level } = req.query;

//     // Get user profile for personalized suggestions
//     const profile = await FitnessProfile.findOne({ userId });

//     // Generate AI-powered workout suggestions
//     const suggestions = await generateWorkoutSuggestions({
//       userId,
//       bmi: profile?.bmi,
//       goal: goal as string || profile?.goal || 'general',
//       type: type as 'home' | 'gym',
//       level: level as string || profile?.fitnessLevel || 'beginner',
//       injuries: profile?.injuries || [],
//     });

//     res.json({
//       success: true,
//       data: suggestions,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error generating workout suggestions',
//       error: error.message,
//     });
//   }
// };

// export const completeWorkout = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user._id;
//     const { workoutId, duration, calories, exercises } = req.body;

//     // Log the workout completion
//     const date = new Date();
//     date.setHours(0, 0, 0, 0);

//     let activityLog = await ActivityLog.findOne({ userId, date });

//     if (!activityLog) {
//       activityLog = new ActivityLog({
//         userId,
//         date,
//         steps: 0,
//         exerciseTime: 0,
//         caloriesBurned: 0,
//         workouts: [],
//       });
//     }

//     activityLog.exerciseTime += duration;
//     activityLog.caloriesBurned += calories;
//     activityLog.workouts.push({
//       workoutId,
//       name: req.body.workoutName || 'Custom Workout',
//       duration,
//       calories,
//       exercises,
//       completedAt: new Date(),
//     });

//     await activityLog.save();

//     // Increment workout completion count
//     if (workoutId) {
//       await Workout.findByIdAndUpdate(workoutId, {
//         $inc: { completedCount: 1 }
//       });
//     }

//     // Update streak
//     await updateUserStreak(userId);

//     res.json({
//       success: true,
//       message: 'Workout completed successfully',
//       data: activityLog,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error completing workout',
//       error: error.message,
//     });
//   }
// };

// export const getProgressAnalytics = async (req: Request, res: Response) => {
//   try {
//     const userId = req.user._id;
//     const { days = 30 } = req.query;

//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - Number(days));

//     const activities = await ActivityLog.find({
//       userId,
//       date: { $gte: startDate },
//     }).sort({ date: 1 });

//     const profile = await FitnessProfile.findOne({ userId });

//     // Calculate analytics
//     const totalCalories = activities.reduce((sum, a) => sum + a.caloriesBurned, 0);
//     const totalExerciseTime = activities.reduce((sum, a) => sum + a.exerciseTime, 0);
//     const totalWorkouts = activities.reduce((sum, a) => sum + a.workouts.length, 0);
//     const averageDailyCalories = totalCalories / activities.length || 0;
//     const averageDailyExercise = totalExerciseTime / activities.length || 0;

//     // Calculate streak
//     let currentStreak = 0;
//     const sortedActivities = activities.sort((a, b) => b.date.getTime() - a.date.getTime());
    
//     for (let i = 0; i < sortedActivities.length; i++) {
//       if (sortedActivities[i].exerciseTime > 0) {
//         currentStreak++;
//       } else {
//         break;
//       }
//     }

//     res.json({
//       success: true,
//       data: {
//         activities,
//         summary: {
//           totalCalories,
//           totalExerciseTime,
//           totalWorkouts,
//           averageDailyCalories,
//           averageDailyExercise,
//           currentStreak: Math.min(currentStreak, profile?.streak || 0),
//           bestStreak: profile?.streak || 0,
//         },
//         chartData: activities.map(a => ({
//           date: a.date,
//           calories: a.caloriesBurned,
//           exerciseTime: a.exerciseTime,
//           steps: a.steps,
//         })),
//       },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching progress analytics',
//       error: error.message,
//     });
//   }
// };

// // Helper function to update user streak
// async function updateUserStreak(userId: string) {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
  
//   const yesterday = new Date(today);
//   yesterday.setDate(yesterday.getDate() - 1);

//   const todayActivity = await ActivityLog.findOne({ 
//     userId, 
//     date: today,
//     exerciseTime: { $gt: 0 },
//   });

//   const yesterdayActivity = await ActivityLog.findOne({ 
//     userId, 
//     date: yesterday,
//     exerciseTime: { $gt: 0 },
//   });

//   const profile = await FitnessProfile.findOne({ userId });

//   if (todayActivity) {
//     if (yesterdayActivity) {
//       // Consecutive day
//       profile.streak += 1;
//     } else {
//       // New streak
//       profile.streak = 1;
//     }
//     profile.lastActive = today;
//     await profile.save();
//   }
// }