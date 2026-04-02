import mongoose, { Schema, Document } from 'mongoose';

export interface IBloodRequest extends Document {
  patient: mongoose.Types.ObjectId;
  bloodGroup: string;
  units: number;
  urgency: 'Low' | 'Medium' | 'High' | 'Critical';
  hospital: string;
  requiredBy: Date;
  status: 'Pending' | 'Matched' | 'Fulfilled' | 'Cancelled' | 'Expired';
  donors: mongoose.Types.ObjectId[];
  patientInfo: {
    name: string;
    age: number;
    gender: string;
    condition: string;
  };
  contact: {
    phone: string;
    email?: string;
    relationship: string;
  };
  location: {
    province: string;
    district: string;
    address: string;
  };
  notes?: string;
  fulfilledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BloodRequestSchema: Schema = new Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    bloodGroup: {
      type: String,
      required: true,
      enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    },
    units: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    urgency: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    hospital: {
      type: String,
      required: true,
    },
    requiredBy: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Matched', 'Fulfilled', 'Cancelled', 'Expired'],
      default: 'Pending',
    },
    donors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    patientInfo: {
      name: { type: String, required: true },
      age: { type: Number, required: true, min: 0 },
      gender: { type: String, enum: ['male', 'female', 'other'], required: true },
      condition: { type: String, required: true },
    },
    contact: {
      phone: { type: String, required: true },
      email: String,
      relationship: { type: String, required: true },
    },
    location: {
      province: { type: String, required: true },
      district: { type: String, required: true },
      address: { type: String, required: true },
    },
    notes: String,
    fulfilledAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
BloodRequestSchema.index({ bloodGroup: 1, status: 1 });
BloodRequestSchema.index({ urgency: -1, createdAt: -1 });
BloodRequestSchema.index({ 'location.province': 1, 'location.district': 1 });
BloodRequestSchema.index({ requiredBy: 1 });

export default mongoose.model<IBloodRequest>('BloodRequest', BloodRequestSchema);