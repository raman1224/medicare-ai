import { Request, Response } from 'express';
import SymptomCheck from '../models/SymptomCheck';
import { DiseaseDatabase } from '../services/diseaseDatabase.service';

// Initialize disease database
const diseaseDB = new DiseaseDatabase();

interface Evidence {
  id: string;
  choice_id: 'present' | 'absent' | 'unknown';
}

export const getSymptoms = async (req: Request, res: Response): Promise<void> => {
  try {
    const symptoms = diseaseDB.getAllSymptoms();
    res.status(200).json({
      success: true,
      data: symptoms
    });
  } catch (error: any) {
    console.error('Get symptoms error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch symptoms'
    });
  }
};

export const analyzeSymptoms = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      symptoms,
      symptomDetails,
      age,
      sex,
      temperature,
      bloodPressure,
      duration,
      description,
      foodIntake,
      medications
    } = req.body;

    if (!symptoms || symptoms.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Please provide at least one symptom'
      });
      return;
    }

    if (!age || !sex) {
      res.status(400).json({
        success: false,
        message: 'Age and sex are required'
      });
      return;
    }

    // Analyze symptoms using disease database
    const analysis = diseaseDB.analyzeSymptoms(symptoms, symptomDetails || {}, temperature, duration);

    // Save to database
    const symptomCheck = new SymptomCheck({
      user: (req as any).user?.id,
      symptoms,
      symptomDetails: symptomDetails || {},
      age,
      sex,
      temperature,
      bloodPressure,
      duration,
      description,
      foodIntake,
      medications,
      diagnosis: analysis.conditions,
      urgencyLevel: analysis.urgency,
      recommendations: analysis.recommendations,
      createdAt: new Date()
    });
    
    await symptomCheck.save();

    res.status(200).json({
      success: true,
      data: analysis
    });
    
  } catch (error: any) {
    console.error('Symptom analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze symptoms',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const { page = 1, limit = 10 } = req.query;
    
    const checks = await SymptomCheck.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip((parseInt(page as string) - 1) * parseInt(limit as string))
      .limit(parseInt(limit as string));
    
    const total = await SymptomCheck.countDocuments({ user: userId });
    
    res.status(200).json({
      success: true,
      data: checks,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error: any) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch history'
    });
  }
};

export const getCheckById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;
    
    const check = await SymptomCheck.findOne({ _id: id, user: userId });
    
    if (!check) {
      res.status(404).json({
        success: false,
        message: 'Check not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: check
    });
  } catch (error: any) {
    console.error('Get check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch check'
    });
  }
};