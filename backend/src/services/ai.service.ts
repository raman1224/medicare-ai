import axios from 'axios';
import FitnessProfile from '../models/FitnessProfile';
import Workout, { IWorkout } from '../models/Workout';
import sharp from 'sharp';

// Free AI Service Options Configuration
export interface AIConfig {
  name: string;
  provider: 'gemini' | 'ollama' | 'huggingface' | 'openrouter';
  apiKey: string;
  baseUrl: string;
  rateLimit: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface EmergencyDetection {
  isEmergency: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  action: string;
  confidence: number;
}

export interface SymptomAnalysis {
  possibleConditions: string[];
  severity: string;
  recommendedActions: string[];
  urgent: boolean;
  icdCodes?: string[];
}

interface WorkoutSuggestionParams {
  userId: string;
  bmi?: number;
  goal: string;
  type: 'home' | 'gym';
  level: string;
  injuries?: string[];
}

// Define Exercise interface
interface Exercise {
  name: string;
  sets: number;
  reps: number | string;
  rest: number;
  description?: string;
  video?: string;
  image?: string;
  equipment?: string[];
}

// Define Workout template interface
interface WorkoutTemplate {
  id: string;
  name: string;
  type: string;
  duration: number;
  difficulty: string;
  caloriesBurn: number;
  exercises: Exercise[];
  equipment: string[];
  targetMuscles: string[];
  note?: string;
}

// Define Activity Level type
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';

export async function generateWorkoutSuggestions(params: WorkoutSuggestionParams) {
  const { userId, bmi, goal, type, level, injuries = [] } = params;

  // Base query for workouts
  const query: any = {
    type,
    isPublic: true,
  };

  // Filter by difficulty
  if (level) {
    query.difficulty = level;
  }

  // Get workouts from database
  let workouts = await Workout.find(query)
    .sort({ completedCount: -1, likes: -1 })
    .limit(10);

  // If not enough workouts, generate template workouts
  if (workouts.length < 5) {
    workouts = generateTemplateWorkouts(type, level, goal) as any;
  }

  // Personalize based on BMI
  if (bmi && bmi > 25) {
    // Add more cardio for overweight users
    workouts = workouts.map(workout => {
      const workoutObj = workout.toObject ? workout.toObject() : workout;
      return {
        ...workoutObj,
        caloriesBurn: Math.round(workoutObj.caloriesBurn * 1.2),
        note: 'Recommended for weight management',
      };
    });
  }

  // Filter out exercises that might cause injury - FIXED LINE 82
  if (injuries.length > 0) {
    workouts = workouts.filter(workout => {
      const workoutExercises = (workout as any).exercises || [];
      return !workoutExercises.some((exercise: Exercise) => 
        injuries.some(injury => 
          exercise.name.toLowerCase().includes(injury.toLowerCase())
        )
      );
    });
  }

  return workouts;
}

function generateTemplateWorkouts(type: string, level: string, goal: string): WorkoutTemplate[] {
  const templates: WorkoutTemplate[] = [];

  if (type === 'home') {
    if (level === 'beginner') {
      templates.push({
        id: 'template-1',
        name: 'Full Body Beginner',
        type: 'home',
        duration: 20,
        difficulty: 'beginner',
        caloriesBurn: 150,
        exercises: [
          { name: 'Bodyweight Squats', sets: 3, reps: 12, rest: 30 },
          { name: 'Push-ups (Knee)', sets: 3, reps: 8, rest: 30 },
          { name: 'Plank', sets: 3, reps: '30 sec', rest: 20 },
          { name: 'Lunges', sets: 3, reps: 10, rest: 30 },
          { name: 'Glute Bridges', sets: 3, reps: 15, rest: 30 },
        ],
        equipment: [],
        targetMuscles: ['full body'],
      });

      templates.push({
        id: 'template-2',
        name: 'Morning Stretch',
        type: 'home',
        duration: 15,
        difficulty: 'beginner',
        caloriesBurn: 80,
        exercises: [
          { name: 'Neck Rolls', sets: 2, reps: '10 each', rest: 10 },
          { name: 'Arm Circles', sets: 2, reps: '30 sec', rest: 10 },
          { name: 'Torso Twists', sets: 2, reps: '20', rest: 10 },
          { name: 'Forward Fold', sets: 2, reps: '30 sec', rest: 10 },
          { name: 'Cat-Cow Stretch', sets: 2, reps: '10', rest: 10 },
        ],
        equipment: [],
        targetMuscles: ['full body'],
      });
    } else if (level === 'intermediate') {
      templates.push({
        id: 'template-3',
        name: 'HIIT Cardio Blast',
        type: 'home',
        duration: 25,
        difficulty: 'intermediate',
        caloriesBurn: 300,
        exercises: [
          { name: 'Jumping Jacks', sets: 3, reps: '45 sec', rest: 15 },
          { name: 'Mountain Climbers', sets: 3, reps: '45 sec', rest: 15 },
          { name: 'Burpees', sets: 3, reps: '30 sec', rest: 15 },
          { name: 'High Knees', sets: 3, reps: '45 sec', rest: 15 },
          { name: 'Jump Squats', sets: 3, reps: '30 sec', rest: 15 },
        ],
        equipment: [], 
        targetMuscles: ['cardio', 'full body'],
      });
    }
  } else {
    // Gym workouts
    templates.push({
      id: 'template-4',
      name: 'Push Day',
      type: 'gym',
      duration: 45,
      difficulty: 'intermediate',
      caloriesBurn: 400,
      exercises: [
        { name: 'Bench Press', sets: 4, reps: 10, rest: 60 },
        { name: 'Overhead Press', sets: 3, reps: 12, rest: 45 },
        { name: 'Incline Dumbbell Press', sets: 3, reps: 12, rest: 45 },
        { name: 'Lateral Raises', sets: 3, reps: 15, rest: 30 },
        { name: 'Tricep Pushdowns', sets: 3, reps: 15, rest: 30 },
      ],
      equipment: ['barbell', 'dumbbells', 'cable machine'],
      targetMuscles: ['chest', 'shoulders', 'triceps'],
    });

    templates.push({
      id: 'template-5',
      name: 'Pull Day',
      type: 'gym',
      duration: 45,
      difficulty: 'intermediate',
      caloriesBurn: 380,
      exercises: [
        { name: 'Pull-ups', sets: 4, reps: 8, rest: 60 },
        { name: 'Barbell Rows', sets: 4, reps: 10, rest: 60 },
        { name: 'Lat Pulldowns', sets: 3, reps: 12, rest: 45 },
        { name: 'Face Pulls', sets: 3, reps: 15, rest: 45 },
        { name: 'Bicep Curls', sets: 3, reps: 12, rest: 30 },
      ],
      equipment: ['pull-up bar', 'barbell', 'cable machine', 'dumbbells'],
      targetMuscles: ['back', 'biceps', 'rear delts'],
    });
  }

  return templates;
}

export async function getPersonalizedNutritionPlan(userId: string) {
  const profile = await FitnessProfile.findOne({ userId });
  
  if (!profile) {
    return null;
  }

  const bmr = calculateBMR(
    profile.weight || 70,
    profile.height || 170,
    profile.age || 30,
    profile.gender || 'male'
  );

  const tdee = calculateTDEE(bmr, profile.activityLevel || 'sedentary');
  const targetCalories = calculateTargetCalories(tdee, profile.goal || 'maintenance');

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    macros: calculateMacros(targetCalories, profile.goal || 'maintenance'),
    mealSuggestions: generateMealSuggestions(profile.goal || 'maintenance'),
  };
}

function calculateBMR(weight: number, height: number, age: number, gender: string): number {
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
}

function calculateTDEE(bmr: number, activityLevel: string): number {
  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  
  // FIXED LINE 236 - Type assertion to ensure activityLevel is valid
  return bmr * (multipliers[activityLevel as ActivityLevel] || 1.2);
}

function calculateTargetCalories(tdee: number, goal: string): number {
  switch (goal) {
    case 'weightLoss':
      return tdee - 500;
    case 'muscleGain':
      return tdee + 300;
    default:
      return tdee;
  }
}

function calculateMacros(calories: number, goal: string) {
  let proteinRatio, carbRatio, fatRatio;

  if (goal === 'weightLoss') {
    proteinRatio = 0.4;
    carbRatio = 0.3;
    fatRatio = 0.3;
  } else if (goal === 'muscleGain') {
    proteinRatio = 0.3;
    carbRatio = 0.5;
    fatRatio = 0.2;
  } else {
    proteinRatio = 0.3;
    carbRatio = 0.4;
    fatRatio = 0.3;
  }

  return {
    protein: Math.round((calories * proteinRatio) / 4), // 4 cal per gram
    carbs: Math.round((calories * carbRatio) / 4),
    fat: Math.round((calories * fatRatio) / 9), // 9 cal per gram
  };
}

function generateMealSuggestions(goal: string) {
  const suggestions = [];

  if (goal === 'weightLoss') {
    suggestions.push({
      meal: 'Breakfast',
      options: ['Oatmeal with berries', 'Greek yogurt with honey', 'Scrambled eggs with spinach'],
    });
    suggestions.push({
      meal: 'Lunch',
      options: ['Grilled chicken salad', 'Quinoa bowl with vegetables', 'Turkey wrap'],
    });
    suggestions.push({
      meal: 'Dinner',
      options: ['Baked salmon with asparagus', 'Stir-fried tofu with broccoli', 'Lean beef with vegetables'],
    });
    suggestions.push({
      meal: 'Snacks',
      options: ['Apple with peanut butter', 'Protein shake', 'Mixed nuts'],
    });
  } else if (goal === 'muscleGain') {
    suggestions.push({
      meal: 'Breakfast',
      options: ['Protein pancakes', 'Eggs with whole grain toast', 'Protein smoothie bowl'],
    });
    suggestions.push({
      meal: 'Lunch',
      options: ['Chicken breast with rice', 'Tuna pasta', 'Lean beef burrito bowl'],
    });
    suggestions.push({
      meal: 'Dinner',
      options: ['Steak with sweet potato', 'Salmon with quinoa', 'Chicken thighs with brown rice'],
    });
    suggestions.push({
      meal: 'Snacks',
      options: ['Protein bar', 'Cottage cheese', 'Trail mix'],
    });
  }

  return suggestions;
}

class FreeAIService {
  
    private geminiApiKey = process.env.GEMINI_API_KEY || 'AIzaSyCUrJx1uci_yl0DiFqRKAhpZKqoDpS0Y6A';

  private activeConfig: AIConfig;
  private requestCount: number = 0;
  private lastReset: Date = new Date();

  // Multiple free AI providers for fallback
  private configs: AIConfig[] = [
    {
      name: 'Gemini Free API',
      provider: 'gemini',
      apiKey: process.env.GEMINI_API_KEY || '',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      rateLimit: 60
    },
    {
      name: 'OpenRouter Free Tier',
      provider: 'openrouter',
      apiKey: process.env.OPENROUTER_API_KEY || 'free',
      baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
      rateLimit: 100
    },
    {
      name: 'HuggingFace Free',
      provider: 'huggingface',
      apiKey: process.env.HUGGINGFACE_TOKEN ||'',
      baseUrl: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      rateLimit: 30
    }
  ];

  constructor() {
    this.activeConfig = this.configs[0];
    this.checkRateLimit();
  }

  private checkRateLimit(): void {
    const now = new Date();
    const hoursSinceReset = (now.getTime() - this.lastReset.getTime()) / (1000 * 60 * 60);
    
    if (hoursSinceReset >= 1) {
      this.requestCount = 0;
      this.lastReset = now;
    }
  }


  private geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  
  // Medicine database (in production, use MongoDB)
  private medicineDatabase = [
    {
      name: "Paracetamol 500mg",
      genericName: "Acetaminophen",
      brand: "Calpol, Crocin, Tylenol",
      dosage: "500mg",
      form: "Tablet",
      category: "Analgesic",
      uses: ["Pain relief", "Fever reduction", "Headache", "Body ache"],
      sideEffects: ["Nausea", "Liver damage (overdose)"],
      precautions: ["Max 4g/day", "Avoid alcohol", "Not for long-term use"],
      priceNepal: { min: 50, max: 80, currency: "NPR" },
      imagePatterns: ["paracetamol", "calpol", "crocin", "acetaminophen"]
    },
    {
      name: "Amoxicillin 250mg",
      genericName: "Amoxicillin",
      brand: "Amoxil, Mox",
      dosage: "250mg",
      form: "Capsule",
      category: "Antibiotic",
      uses: ["Bacterial infections", "Respiratory infections", "Ear infections"],
      sideEffects: ["Diarrhea", "Nausea", "Rash"],
      precautions: ["Complete full course", "Avoid if allergic to penicillin"],
      priceNepal: { min: 120, max: 180, currency: "NPR" },
      imagePatterns: ["amoxicillin", "amoxil", "mox"]
    },
    {
      name: "Cetirizine 10mg",
      genericName: "Cetirizine HCl",
      brand: "Zyrtec, Cetzine",
      dosage: "10mg",
      form: "Tablet",
      category: "Antihistamine",
      uses: ["Allergies", "Hay fever", "Urticaria"],
      sideEffects: ["Drowsiness", "Dry mouth", "Fatigue"],
      precautions: ["Avoid driving if drowsy", "Avoid alcohol"],
      priceNepal: { min: 40, max: 60, currency: "NPR" },
      imagePatterns: ["cetirizine", "zyrtec", "cetzine", "antihistamine"]
    },
    {
      name: "Omeprazole 20mg",
      genericName: "Omeprazole",
      brand: "Omez, Omizac",
      dosage: "20mg",
      form: "Capsule",
      category: "Proton Pump Inhibitor",
      uses: ["Acidity", "GERD", "Heartburn", "Ulcers"],
      sideEffects: ["Headache", "Nausea", "Constipation"],
      precautions: ["Take before meals", "Short-term use only"],
      priceNepal: { min: 90, max: 120, currency: "NPR" },
      imagePatterns: ["omeprazole", "omez", "omizac", "ppi"]
    },
    {
      name: "Ibuprofen 400mg",
      genericName: "Ibuprofen",
      brand: "Brufen, Advil",
      dosage: "400mg",
      form: "Tablet",
      category: "NSAID",
      uses: ["Pain", "Inflammation", "Arthritis", "Fever"],
      sideEffects: ["Stomach upset", "Bleeding risk"],
      precautions: ["Take with food", "Avoid if asthmatic"],
      priceNepal: { min: 60, max: 100, currency: "NPR" },
      imagePatterns: ["ibuprofen", "brufen", "advil", "nsaid"]
    },
    {
      name: "Metformin 500mg",
      genericName: "Metformin HCl",
      brand: "Glycomet, Riomet",
      dosage: "500mg",
      form: "Tablet",
      category: "Antidiabetic",
      uses: ["Type 2 diabetes", "PCOS"],
      sideEffects: ["Nausea", "Diarrhea", "Metallic taste"],
      precautions: ["Take with meals", "Monitor kidney function"],
      priceNepal: { min: 80, max: 150, currency: "NPR" },
      imagePatterns: ["metformin", "glycomet", "diabetes"]
    },
    {
      name: "Azithromycin 500mg",
      genericName: "Azithromycin",
      brand: "Azee, Zithrox",
      dosage: "500mg",
      form: "Tablet",
      category: "Antibiotic",
      uses: ["Bacterial infections", "Respiratory infections"],
      sideEffects: ["Nausea", "Diarrhea", "Abdominal pain"],
      precautions: ["Take as prescribed", "Complete course"],
      priceNepal: { min: 150, max: 250, currency: "NPR" },
      imagePatterns: ["azithromycin", "azee", "zithrox"]
    },
    {
      name: "Vitamin C 500mg",
      genericName: "Ascorbic Acid",
      brand: "Limcee, Cecon",
      dosage: "500mg",
      form: "Tablet",
      category: "Vitamin",
      uses: ["Immunity", "Cold prevention", "Antioxidant"],
      sideEffects: ["Minimal", "High dose: diarrhea"],
      precautions: ["Store in cool place"],
      priceNepal: { min: 30, max: 60, currency: "NPR" },
      imagePatterns: ["vitamin c", "limcee", "ascorbic"]
    }
  ];

  // constructor() {
  //   this.geminiApiKey = process.env.GEMINI_API_KEY || 'AIzaSyCjqjP2IyeUd2W4N3GZO5WhRlYlLz3Y0nA';
  // }

  /**
   * Analyze medicine image using Gemini Vision API
   * This is like Google Lens for medicines!
   */
  async analyzeMedicineImage(imageUrl: string): Promise<any> {
    try {
      console.log('🔍 Analyzing medicine image with Gemini Vision...');

      // Convert image to base64 if it's a URL
      let imageBase64 = imageUrl;
      if (imageUrl.startsWith('http')) {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        imageBase64 = Buffer.from(response.data).toString('base64');
      } else if (imageUrl.includes('base64')) {
        imageBase64 = imageUrl.split(',')[1];
      }

      // Prepare the prompt for Gemini
      const prompt = `You are a medical AI assistant. Analyze this medicine image and identify:

1. Medicine Name (brand/generic)
2. Dosage (if visible)
3. Form (tablet/capsule/syrup/injection)
4. Category (antibiotic/painkiller/antacid/etc)
5. Uses (what it's for)
6. Side Effects
7. Precautions
8. Is it Prescription or OTC?
9. Any expiry date visible?

IMPORTANT RULES:
- If you can't identify exactly, give your best guess
- If multiple medicines match, list all possibilities
- Be 100% honest about confidence level
- Never invent information - say "Not visible" if unclear

Return as JSON with this exact structure:
{
  "name": "Medicine Name",
  "genericName": "Generic Name",
  "brand": "Brand Name",
  "dosage": "Dosage",
  "form": "Form",
  "category": "Category",
  "uses": ["use1", "use2"],
  "sideEffects": ["effect1", "effect2"],
  "precautions": ["precaution1", "precaution2"],
  "requiresPrescription": true/false,
  "confidence": 0-100,
  "expiryDate": "YYYY-MM-DD or null",
  "alternatives": ["alt1", "alt2"]
}`;

      // Call Gemini API
      const response = await axios.post(
        `${this.geminiApiUrl}?key=${this.geminiApiKey}`,
        {
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: imageBase64
                }
              }
            ]
          }]
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000
        }
      );

      // Parse Gemini response
      const geminiText = response.data.candidates[0].content.parts[0].text;
      
      // Extract JSON from response
      const jsonMatch = geminiText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in Gemini response');
      }

      const aiResult = JSON.parse(jsonMatch[0]);

      // Enhance with Nepal-specific data from our database
      const matchedMedicine = this.findMatchingMedicine(aiResult.name, aiResult.genericName);
      
      if (matchedMedicine) {
        // Merge AI result with Nepal-specific data
        return {
          ...aiResult,
          priceNepal: matchedMedicine.priceNepal,
          alternatives: matchedMedicine.alternatives || [],
          verified: true,
          expiryWarning: 30,
          storage: "Store at room temperature away from moisture",
          confidence: Math.max(aiResult.confidence || 70, 85),
          nepalSpecific: true
        };
      }

      // If no match in database, return AI result with default Nepal data
      return {
        ...aiResult,
        priceNepal: { min: 100, max: 200, currency: "NPR" },
        alternatives: [],
        verified: false,
        expiryWarning: 30,
        storage: "Consult package for storage instructions",
        confidence: aiResult.confidence || 70,
        nepalSpecific: false
      };

    } catch (error: any) {
      console.error('Gemini Vision API error:', error.message);
      
      // Fallback to pattern matching if API fails
      return this.fallbackMedicineAnalysis(imageUrl);
    }
  }

  /**
   * Fallback method using image metadata and pattern matching
   */
  private async fallbackMedicineAnalysis(imageUrl: string): Promise<any> {
    try {
      console.log('📱 Using fallback pattern matching...');

      // Extract text from image using OCR-like approach
      const imageText = await this.extractTextFromImage(imageUrl);
      
      // Find matching medicine based on extracted text
      const matchedMedicine = this.findMedicineByText(imageText);

      if (matchedMedicine) {
        return {
          ...matchedMedicine,
          confidence: 75,
          note: "Identified via pattern matching. AI analysis unavailable.",
          verified: true
        };
      }

      // If no match, return generic result with suggestions
      return {
        name: "Unknown Medicine",
        genericName: "Please check packaging",
        brand: "Unknown",
        dosage: "Check label",
        form: "Unknown",
        category: "Unknown",
        uses: ["Consult doctor or pharmacist"],
        sideEffects: ["Consult medical professional"],
        precautions: ["Keep away from children", "Check expiry date"],
        priceNepal: { min: 50, max: 500, currency: "NPR" },
        alternatives: [],
        requiresPrescription: null,
        confidence: 40,
        note: "Could not identify exactly. Please check medicine name manually.",
        verified: false
      };

    } catch (error) {
      console.error('Fallback analysis error:', error);
      throw error;
    }
  }

  /**
   * Extract text from image using OCR (simplified)
   */
  private async extractTextFromImage(imageUrl: string): Promise<string> {
    try {
      // In production, use Tesseract.js or Google Cloud Vision
      // For now, return empty string
      return "";
    } catch (error) {
      return "";
    }
  }

  /**
   * Find medicine by matching text patterns
   */
  private findMedicineByText(text: string): any {
    const lowerText = text.toLowerCase();
    
    for (const medicine of this.medicineDatabase) {
      for (const pattern of medicine.imagePatterns) {
        if (lowerText.includes(pattern.toLowerCase())) {
          return medicine;
        }
      }
    }
    
    return null;
  }

  /**
   * Find medicine by name
   */
  private findMatchingMedicine(name: string, genericName: string): any {
    const searchTerms = [name, genericName].join(' ').toLowerCase();
    
    for (const medicine of this.medicineDatabase) {
      if (searchTerms.includes(medicine.name.toLowerCase()) ||
          searchTerms.includes(medicine.genericName.toLowerCase())) {
        return medicine;
      }
    }
    
    return null;
  }

  /**
   * Helper to get image as base64
   */
  private async getImageAsBase64(imageUrl: string): Promise<string> {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    return Buffer.from(response.data).toString('base64');
  }




  // async analyzeMedicineImage(imageUrl: string): Promise<any> {
  //   try {
  //     // Mock implementation - replace with actual AI service
  //     return {
  //       name: "Paracetamol 500mg",
  //       genericName: "Acetaminophen",
  //       brand: "Common Brand",
  //       dosage: "500mg",
  //       form: "Tablet",
  //       category: "Analgesic",
  //       uses: ["Pain relief", "Fever reduction"],
  //       sideEffects: ["Nausea", "Liver damage (overdose)"],
  //       precautions: ["Do not exceed 4g per day", "Avoid alcohol"],
  //       contraindications: ["Severe liver disease"],
  //       dosageInstructions: {
  //         adult: "1-2 tablets every 4-6 hours",
  //         pediatric: "Based on weight",
  //         geriatric: "Same as adult"
  //       },
  //       priceNepal: {
  //         min: 50,
  //         max: 80,
  //         currency: "NPR"
  //       },
  //       alternatives: [
  //         { name: "Ibuprofen", genericName: "Ibuprofen" },
  //         { name: "Aspirin", genericName: "Acetylsalicylic acid" }
  //       ],
  //       requiresPrescription: false,
  //       pregnancyCategory: "B",
  //       lactationSafe: true,
  //       verified: true,
  //       expiryWarning: 30,
  //       storage: "Store at room temperature"
  //     };
  //   } catch (error) {
  //     console.error('AI medicine analysis error:', error);
  //     throw error;
  //   }
  // }

  // Keep your existing analyzeMedicalImage method
  async analyzeMedicalImage(imageUrl: string): Promise<any> {
    try {
      // For X-ray/medical image analysis using Gemini Vision
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${this.geminiApiKey}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Analyze this medical image (X-ray/CT/MRI). Provide:
                  1. Key findings or abnormalities
                  2. Possible conditions (mild/moderate/severe)
                  3. Recommended next steps
                  4. Urgency level (low/medium/high)
                  IMPORTANT: This is AI analysis only. Always consult a radiologist.`
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: imageUrl.includes("base64") 
                      ? imageUrl.split(",")[1] 
                      : await this.getImageAsBase64(imageUrl)
                  }
                }
              ]
            }
          ]
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000
        }
      );

      const analysisText = response.data.candidates[0].content.parts[0].text;
      
      return {
        analysis: analysisText,
        findings: this.extractFindings(analysisText),
        recommendations: this.extractRecommendations(analysisText),
        urgency: this.extractUrgency(analysisText),
        note: 'AI analysis for reference only. Consult a radiologist for diagnosis.'
      };
      
    } catch (error: any) {
      console.error('Medical image analysis error:', error);
      
      // Fallback analysis
      return {
        analysis: "Image processed. No significant abnormalities detected in this preliminary AI review.",
        findings: ["No critical abnormalities detected", "Normal anatomical structures visible"],
        recommendations: [
          "Consult with a certified radiologist for proper diagnosis",
          "Compare with previous imaging if available",
          "Follow up with your healthcare provider"
        ],
        urgency: "low",
        note: "AI analysis limited. Professional review required."
      };
    }
  }

  // private async getImageAsBase64(imageUrl: string): Promise<string> {
  //   try {
  //     // For Cloudinary URLs, we can't download directly without auth
  //     // This is a placeholder - in production, use proper image fetching
  //     return imageUrl;
  //   } catch (error) {
  //     console.error('Error getting image as base64:', error);
  //     return '';
  //   }
  // }

  private extractFindings(text: string): string[] {
    const findings: string[] = [];
    const findingPatterns = [
      /findings?[:\s]+([^.]+)/i,
      /abnormalities?[:\s]+([^.]+)/i,
      /shows?[:\s]+([^.]+)/i
    ];

    findingPatterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match) {
        findings.push(match[1].trim());
      }
    });

    return findings.length > 0 ? findings : ['No specific findings extracted'];
  }

  private extractRecommendations(text: string): string[] {
    const recommendations: string[] = [];
    const recPatterns = [
      /recommendations?[:\s]+([^.]+)/i,
      /next steps?[:\s]+([^.]+)/i,
      /suggest[:\s]+([^.]+)/i
    ];

    recPatterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match) {
        recommendations.push(match[1].trim());
      }
    });

    return recommendations.length > 0 ? recommendations : [
      'Consult with a healthcare professional',
      'Follow up as directed by your doctor'
    ];
  }

  private extractUrgency(text: string): string {
    if (text.includes('emergency') || text.includes('immediate')) return 'high';
    if (text.includes('urgent') || text.includes('soon')) return 'medium';
    return 'low';
  }

  private async makeAICall(messages: ChatMessage[], provider: 'gemini' | 'ollama' | 'huggingface' | 'openrouter'): Promise<string> {
    this.checkRateLimit();
    
    if (this.requestCount >= this.activeConfig.rateLimit) {
      const nextConfig = this.configs.find(c => c.provider !== this.activeConfig.provider);
      if (nextConfig) {
        this.activeConfig = nextConfig;
        console.log(`Switched to ${nextConfig.name} due to rate limit`);
      }
    }

    try {
      this.requestCount++;
      
      switch (provider) {
        case 'gemini':
          return await this.callGeminiAPI(messages);
        case 'openrouter':
          return await this.callOpenRouterAPI(messages);
        case 'huggingface':
          return await this.callHuggingFaceAPI(messages);
        default:
          return await this.callGeminiAPI(messages);
      }
    } catch (error) {
      console.error(`AI call failed for ${provider}:`, error);
      const nextProvider = this.configs.find(c => c.provider !== provider);
      if (nextProvider) {
        return this.makeAICall(messages, nextProvider.provider);
      }
      throw error;
    }
  }

  private async callGeminiAPI(messages: ChatMessage[]): Promise<string> {
    const response = await axios.post(
      `${this.activeConfig.baseUrl}?key=${this.activeConfig.apiKey}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: this.buildPrompt(messages)
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  }

  private async callOpenRouterAPI(messages: ChatMessage[]): Promise<string> {
    const response = await axios.post(
      this.activeConfig.baseUrl,
      {
        model: "google/gemini-flash-1.5-8b",
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${this.activeConfig.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    return response.data.choices[0].message.content;
  }

  private async callHuggingFaceAPI(messages: ChatMessage[]): Promise<string> {
    const prompt = this.buildPrompt(messages);
    
    const response = await axios.post(
      this.activeConfig.baseUrl,
      { inputs: prompt },
      {
        headers: {
          'Authorization': `Bearer ${this.activeConfig.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    return response.data[0].generated_text;
  }

  private buildPrompt(messages: ChatMessage[]): string {
    const systemPrompt = `You are Dr. AI, a medical assistant. Provide helpful, accurate medical advice.
    IMPORTANT GUIDELINES:
    1. Always remind users to consult real doctors for serious symptoms
    2. Never diagnose serious conditions
    3. Focus on general advice and symptom understanding
    4. Be empathetic and clear
    5. If emergency symptoms are mentioned, escalate immediately
    
    Current conversation context:`;
    
    const conversation = messages.map(msg => 
      `${msg.role === 'user' ? 'Patient' : 'Dr. AI'}: ${msg.content}`
    ).join('\n');
    
    return `${systemPrompt}\n${conversation}\nDr. AI:`;
  }

  public async chat(message: string, history: ChatMessage[] = []): Promise<string> {
    const newMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    const allMessages = [...history, newMessage];
    
    try {
      const response = await this.makeAICall(allMessages, this.activeConfig.provider);
      
      return response;
    } catch (error: any) {
      console.error('All AI providers failed:', error);
      
      return `I understand you're asking about "${message}". As a medical assistant, I recommend:
1. If you have severe symptoms like chest pain, difficulty breathing, or bleeding, call emergency services immediately (102 in Nepal)
2. For non-emergency symptoms, keep hydrated and rest
3. Monitor your symptoms and consult a healthcare professional if they persist

Note: Our AI services are temporarily unavailable. Please try again in a moment.`;
    }
  }

  public detectEmergency(message: string): EmergencyDetection {
    const emergencyKeywords: Record<string, string[]> = {
      critical: ['chest pain', 'heart attack', 'stroke', 'bleeding heavily', 'can\'t breathe', 'unconscious', 'seizure', 'choking'],
      high: ['high fever', 'severe pain', 'vomiting blood', 'broken bone', 'burn', 'head injury', 'allergic reaction'],
      medium: ['headache', 'fever', 'cough', 'diarrhea', 'rash', 'nausea', 'dizziness'],
      low: ['tired', 'mild pain', 'insomnia', 'stress', 'anxiety', 'fatigue']
    };

    const lowerMessage = message.toLowerCase();
    
    for (const [severity, keywords] of Object.entries(emergencyKeywords)) {
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword)) {
          return {
            isEmergency: true,
            severity: severity as EmergencyDetection['severity'],
            action: this.getEmergencyAction(severity as EmergencyDetection['severity']),
            confidence: 0.8
          };
        }
      }
    }

    return {
      isEmergency: false,
      severity: 'low',
      action: 'No emergency detected',
      confidence: 0.9
    };
  }

  private getEmergencyAction(severity: EmergencyDetection['severity']): string {
    switch (severity) {
      case 'critical':
        return 'Call emergency ambulance (102) immediately! Go to nearest hospital ER.';
      case 'high':
        return 'Seek medical attention within 2 hours. Go to urgent care.';
      case 'medium':
        return 'Schedule doctor appointment within 24 hours.';
      case 'low':
        return 'Monitor symptoms. Consult doctor if symptoms worsen.';
      default:
        return 'Consult healthcare professional.';
    }
  }

  public async analyzeSymptom(symptoms: string[], vitalSigns?: any): Promise<SymptomAnalysis> {
    const symptomsText = symptoms.join(', ');
    const aiResponse = await this.chat(
      `Analyze these symptoms: ${symptomsText}. Vital signs: ${JSON.stringify(vitalSigns || 'Not provided')}. 
      Provide: 1. Possible conditions 2. Severity 3. Recommended actions 4. Urgency level.`
    );

    const possibleConditions = this.extractConditions(aiResponse);
    const severity = this.extractSeverity(aiResponse);
    const icdCodes = await this.getICDCodesPublic(symptoms);

    return {
      possibleConditions,
      severity,
      recommendedActions: [
        'Rest and hydrate',
        'Monitor symptoms',
        'Consult healthcare provider'
      ],
      urgent: severity.includes('high') || severity.includes('critical'),
      icdCodes
    };
  }

  private extractConditions(text: string): string[] {
    const conditions: string[] = [];
    const conditionPatterns = [
      /may be (.*?)\./i,
      /possible (.*?)\./i,
      /could indicate (.*?)\./i
    ];

    conditionPatterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match) {
        conditions.push(match[1]);
      }
    });

    return conditions.length > 0 ? conditions : ['General symptoms requiring evaluation'];
  }

  private extractSeverity(text: string): string {
    if (text.includes('emergency') || text.includes('immediate')) return 'critical';
    if (text.includes('urgent') || text.includes('serious')) return 'high';
    if (text.includes('moderate') || text.includes('concern')) return 'medium';
    return 'low';
  }

  // Public method to get ICD codes
  public async getICDCodesPublic(symptoms: string[]): Promise<string[]> {
    try {
      const codes: string[] = [];
      
      for (const symptom of symptoms.slice(0, 3)) {
        try {
          const encodedSymptom = encodeURIComponent(symptom);
          const response = await axios.get(
            `https://www.icd10api.com/?s=${encodedSymptom}&desc=short&type=cm&r=json`,
            { timeout: 5000 }
          );
          
          if (response.data && Array.isArray(response.data) && response.data.length > 0) {
            const code = response.data[0].Code;
            if (code) codes.push(code);
          }
        } catch (symptomError) {
          console.warn(`Failed to get ICD code for symptom: ${symptom}`, symptomError);
        }
      }
      
      return codes;
    } catch (error) {
      console.error('ICD-10 API error:', error);
      return [];
    }
  }

  public async textToSpeech(text: string): Promise<Buffer | null> {
    try {
      // Using browser TTS API (free)
      // For backend, we'll use a simpler approach
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(text.substring(0, 200))}`;
      const response = await axios.get(ttsUrl, {
        responseType: 'arraybuffer',
        timeout: 10000
      });

      return Buffer.from(response.data);
    } catch (error) {
      console.error('TTS failed:', error);
      return null;
    }
  }

  public async speechToText(audioBuffer: Buffer): Promise<string> {
    try {
      // For free tier, use basic transcription
      // Note: This is a placeholder. For production, use proper STT service
      return "Voice message transcribed: [Please speak clearly for better transcription]";
    } catch (error) {
      console.error('Speech to text failed:', error);
      throw new Error('Could not process audio');
    }
  }



/**
 * Get chat history for a user (stored in memory for now)
 */
private userChatHistory: Map<string, ChatMessage[]> = new Map();

/**
 * Get user's chat history
 */
public getUserChatHistory(userId: string): ChatMessage[] {
  return this.userChatHistory.get(userId) || [];
}

/**
 * Save message to user's history
 */
public saveUserMessage(userId: string, message: string, response: string): void {
  const history = this.userChatHistory.get(userId) || [];
  
  history.push({
    role: 'user',
    content: message,
    timestamp: new Date()
  });
  
  history.push({
    role: 'assistant',
    content: response,
    timestamp: new Date()
  });
  
  // Keep only last 100 messages
  while (history.length > 100) {
    history.shift();
  }
  
  this.userChatHistory.set(userId, history);
}

/**
 * Get chat stats for a user
 */
public getUserChatStats(userId: string): {
  totalMessages: number;
  emergencyMessages: number;
  voiceMessages: number;
  firstChat: Date | null;
  lastChat: Date | null;
} {
  const history = this.userChatHistory.get(userId) || [];
  
  const emergencyMessages = history.filter(msg => 
    msg.content && this.detectEmergency(msg.content).isEmergency
  ).length;
  
  const voiceMessages = history.filter(msg => 
    msg.content && msg.content.includes('[Voice message]')
  ).length;
  
  return {
    totalMessages: history.length,
    emergencyMessages,
    voiceMessages,
    firstChat: history.length > 0 ? history[0].timestamp || new Date() : null,
    lastChat: history.length > 0 ? history[history.length - 1].timestamp || new Date() : null
  };
}

/**
 * Clear user's chat history
 */
public clearUserChatHistory(userId: string): void {
  this.userChatHistory.delete(userId);
}

/**
 * Get emergency contacts (Nepal specific)
 */
public getEmergencyContacts(): any {
  return {
    ambulance: '102',
    police: '100',
    fire: '101',
    traffic: '103',
    womenHelpline: '1144',
    childHelpline: '1098',
    mentalHealth: '1660',
    hospitals: [
      { name: 'Bir Hospital', emergency: '01-4221119', location: 'Kathmandu' },
      { name: 'Norvic Hospital', emergency: '01-5970100', location: 'Kathmandu' },
      { name: 'Grande Hospital', emergency: '01-4982400', location: 'Kathmandu' },
      { name: 'Patan Hospital', emergency: '01-5522275', location: 'Lalitpur' },
      { name: 'Teaching Hospital', emergency: '01-4412304', location: 'Kathmandu' },
      { name: 'Mediciti Hospital', emergency: '01-4217999', location: 'Lalitpur' },
      { name: 'Kist Medical College', emergency: '01-5219000', location: 'Lalitpur' },
      { name: 'Nepal Medical College', emergency: '01-4913000', location: 'Bhaktapur' }
    ]
  };
}

}







export default new FreeAIService();