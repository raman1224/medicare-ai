// src/models/Doctor.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IDoctor extends Document {
  user: mongoose.Types.ObjectId;
  licenseNumber: string;
  specialization: string;
  qualifications: string[];
  experience: number;
  hospital?: mongoose.Types.ObjectId;
  consultationFee: number;
  availableDays: string[];
  availableHours: {
    start: string;
    end: string;
  };
  languages: string[];
  rating: number;
  totalReviews: number;
  verified: boolean;
  services: string[];
  education: {
    degree: string;
    institute: string;
    year: number;
  }[];
  isAvailable: boolean;
  consultationTypes: {
    video: boolean;
    inPerson: boolean;
    chat: boolean;
  };
}

const DoctorSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    licenseNumber: {
      type: String,
      required: [true, 'Please provide license number'],
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, 'Please provide specialization'],
      enum: [
        'Cardiologist',
        'Dermatologist',
        'Pediatrician',
        'Orthopedic',
        'Neurologist',
        'Psychiatrist',
        'Gynecologist',
        'Dentist',
        'General Physician',
        'ENT Specialist',
        'Eye Specialist',
        'Surgeon',
        'Other',
      ],
    },
    qualifications: {
      type: [String],
      required: [true, 'Please provide qualifications'],
    },
    experience: {
      type: Number,
      required: [true, 'Please provide years of experience'],
      min: 0,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
    },
    consultationFee: {
      type: Number,
      required: [true, 'Please provide consultation fee'],
      min: 0,
    },
    availableDays: {
      type: [String],
      required: true,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    availableHours: {
      start: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      },
      end: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      },
    },
    languages: {
      type: [String],
      default: ['English', 'Nepali'],
    },
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
    services: {
      type: [String],
      default: [],
    },
    education: [
      {
        degree: String,
        institute: String,
        year: Number,
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    consultationTypes: {
      video: {
        type: Boolean,
        default: false,
      },
      inPerson: {
        type: Boolean,
        default: true,
      },
      chat: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for reviews
DoctorSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'doctor',
});

// Indexes for faster queries
DoctorSchema.index({ specialization: 1 });
DoctorSchema.index({ rating: -1 });
DoctorSchema.index({ 'consultationTypes.video': 1 });
DoctorSchema.index({ 'consultationTypes.inPerson': 1 });
DoctorSchema.index({ verified: 1 });

export default mongoose.model<IDoctor>('Doctor', DoctorSchema);
