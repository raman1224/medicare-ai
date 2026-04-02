// // src/routes/fitness.routes.ts
// import { Router } from 'express';
// import {
//   getFitnessData,
//   addFitnessEntry,
//   updateFitnessEntry,
//   deleteFitnessEntry,
//   getFitnessStatistics,
//   getBMICalculation,
//   getCalorieRecommendation,
//   getWorkoutPlan,
//   getMealPlan,
// } from '../controllers/fitness.controller';
// import { protect, checkVerification } from '../middleware/auth.middleware';
// import { validate } from '../middleware/validation.middleware';
// import { body, query } from 'express-validator';

// const router = Router();

// router.use(protect);
// router.use(checkVerification);

// router.get('/', [
//   query('type').optional().isIn(['steps', 'sleep', 'weight', 'workout', 'meal']),
//   query('startDate').optional().isISO8601(),
//   query('endDate').optional().isISO8601(),
//   validate,
// ], getFitnessData);

// router.post('/', [
//   body('type').isIn(['steps', 'sleep', 'weight', 'workout', 'meal']),
//   body('value').notEmpty(),
//   body('date').optional().isISO8601(),
//   body('notes').optional().isString(),
//   validate,
// ], addFitnessEntry);

// router.put('/:id', updateFitnessEntry);
// router.delete('/:id', deleteFitnessEntry);

// router.get('/stats', getFitnessStatistics);
// router.get('/bmi', getBMICalculation);
// router.get('/calories', getCalorieRecommendation);
// router.get('/workout-plan', getWorkoutPlan);
// router.get('/meal-plan', getMealPlan);

// export default router;

// // backend/src/routes/fitness.routes.ts
// // import { Router } from 'express';
// // import { authenticate } from '../middleware/auth.middleware';
// // import { validate } from '../middleware/validation.middleware';
// // import {
// //   createFitnessProfile,
// //   getFitnessProfile,
// //   calculateBMIEndpoint,
// //   logActivity,
// //   getTodayActivity,
// //   getWorkoutSuggestions,
// //   completeWorkout,
// //   getProgressAnalytics,
// // } from '../controllers/fitness.controller';
// // import {
// //   getTrainerProfile,
// //   createTrainerProfile,
// //   getTrainers,
// //   assignClient,
// //   getClientProgress,
// // } from '../controllers/fitness.trainer.controller';

// // const router = Router();

// // // All fitness routes require authentication
// // router.use(authenticate);

// // // Profile routes
// // router.post('/profile', validate('fitnessProfile'), createFitnessProfile);
// // router.get('/profile', getFitnessProfile);

// // // BMI calculator
// // router.post('/bmi', validate('bmi'), calculateBMIEndpoint);

// // // Activity tracking
// // router.post('/activities', validate('activity'), logActivity);
// // router.get('/activities/today', getTodayActivity);
// // router.get('/analytics', getProgressAnalytics);

// // // Workouts
// // router.get('/workouts/suggestions', getWorkoutSuggestions);
// // router.post('/workouts/complete', validate('workoutComplete'), completeWorkout);

// // // Trainer routes
// // router.get('/trainers', getTrainers);
// // router.get('/trainer/profile', getTrainerProfile);
// // router.post('/trainer/profile', validate('trainerProfile'), createTrainerProfile);
// // router.post('/trainer/assign', validate('assignClient'), assignClient);
// // router.get('/trainer/client/:clientId/progress', getClientProgress);

// // export default router;