// src/models/Medicine.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMedicine extends Document {
  name: string;
  genericName: string;
  brand: string;
  dosage: string;
  form: string;
  category: string;
  ingredients: {
    name: string;
    strength: string;
  }[];
  uses: string[];
  sideEffects: string[];
  precautions: string[];
  contraindications: string[];
  dosageInstructions: {
    adult: string;
    pediatric: string;
    geriatric: string;
  };
  storage: string;
  expiryWarning: number; // days before expiry to warn
  priceNepal: {
    min: number;
    max: number;
    currency: string;
  };
  alternatives: mongoose.Types.ObjectId[];
  requiresPrescription: boolean;
  pregnancyCategory?: string;
  lactationSafe?: boolean;
  images: string[];
  verified: boolean;
  lastUpdated: Date;
}

const MedicineSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide medicine name'],
      trim: true,
      index: true,
    },
    genericName: {
      type: String,
      required: [true, 'Please provide generic name'],
    },
    brand: {
      type: String,
      required: [true, 'Please provide brand name'],
    },
    dosage: {
      type: String,
      required: [true, 'Please provide dosage'],
    },
    form: {
      type: String,
      enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drops', 'Inhaler', 'Other'],
      required: true,
    },
    category: {
      type: String,
      enum: [
        'Analgesic',
        'Antibiotic',
        'Antiviral',
        'Antifungal',
        'Antihistamine',
        'Antacid',
        'Antidepressant',
        'Antidiabetic',
        'Cardiovascular',
        'CNS',
        'Gastrointestinal',
        'Hormonal',
        'Vitamin',
        'Other',
      ],
      required: true,
    },
    ingredients: [
      {
        name: String,
        strength: String,
      },
    ],
    uses: {
      type: [String],
      required: true,
    },
    sideEffects: {
      type: [String],
      default: [],
    },
    precautions: {
      type: [String],
      default: [],
    },
    contraindications: {
      type: [String],
      default: [],
    },
    dosageInstructions: {
      adult: String,
      pediatric: String,
      geriatric: String,
    },
    storage: {
      type: String,
      default: 'Store at room temperature away from light and moisture',
    },
    expiryWarning: {
      type: Number,
      default: 30, // 30 days before expiry
    },
    priceNepal: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: 'NPR',
      },
    },
    alternatives: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medicine',
      },
    ],
    requiresPrescription: {
      type: Boolean,
      default: false,
    },
    pregnancyCategory: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'X', null],
    },
    lactationSafe: {
      type: Boolean,
    },
    images: {
      type: [String],
      default: [],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
MedicineSchema.index({ 
  name: 'text', 
  genericName: 'text', 
  brand: 'text',
  uses: 'text'
});

export default mongoose.model<IMedicine>('Medicine', MedicineSchema);
