// src/models/Hospital.ts
import mongoose, { Schema, Document } from 'mongoose';

interface ICoordinates {
  lat: number;
  lng: number;
}

export interface IHospital extends Document {
  name: string;
  type: 'Government' | 'Private' | 'Community';
  address: {
    province: string;
    district: string;
    municipality: string;
    ward: number;
    street: string;
  };
  coordinates: ICoordinates;
  contact: {
    phone: string[];
    emergency: string[];
    email?: string;
    website?: string;
  };
  departments: string[];
  facilities: string[];
  emergency: {
    available: boolean;
    beds: number;
    doctors: number;
    services: string[];
  };
  doctors: mongoose.Types.ObjectId[];
  beds: {
    total: number;
    available: number;
    icu: number;
    ventilator: number;
    oxygen: number;
  };
  workingHours: {
    [key: string]: {
      open: string;
      close: string;
      emergency: boolean;
    };
  };
  rating: number;
  reviews: number;
  verified: boolean;
  images: string[];
}

const HospitalSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide hospital name'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['Government', 'Private', 'Community'],
      required: true,
    },
    address: {
      province: {
        type: String,
        required: true,
        enum: ['Province 1', 'Province 2', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'],
      },
      district: {
        type: String,
        required: true,
      },
      municipality: {
        type: String,
        required: true,
      },
      ward: {
        type: Number,
        required: true,
        min: 1,
        max: 35,
      },
      street: {
        type: String,
      },
    },
    coordinates: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },
    contact: {
      phone: {
        type: [String],
        required: true,
      },
      emergency: {
        type: [String],
        required: true,
      },
      email: String,
      website: String,
    },
    departments: {
      type: [String],
      required: true,
      enum: [
        'Emergency',
        'Cardiology',
        'Neurology',
        'Orthopedics',
        'Pediatrics',
        'Gynecology',
        'Dental',
        'Eye',
        'ENT',
        'Surgery',
        'ICU',
        'Laboratory',
        'Radiology',
        'Pharmacy',
      ],
    },
    facilities: {
      type: [String],
      default: [],
      enum: [
        'Ambulance',
        'Pharmacy',
        'Laboratory',
        'X-Ray',
        'CT Scan',
        'MRI',
        'ICU',
        'Operation Theater',
        'Blood Bank',
        'Cafeteria',
        'Parking',
        'Wheelchair Access',
        'WiFi',
      ],
    },
    emergency: {
      available: {
        type: Boolean,
        default: true,
      },
      beds: {
        type: Number,
        default: 0,
      },
      doctors: {
        type: Number,
        default: 0,
      },
      services: {
        type: [String],
        default: [],
      },
    },
    doctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
      },
    ],
    beds: {
      total: {
        type: Number,
        required: true,
        min: 0,
      },
      available: {
        type: Number,
        required: true,
        min: 0,
      },
      icu: {
        type: Number,
        default: 0,
      },
      ventilator: {
        type: Number,
        default: 0,
      },
      oxygen: {
        type: Number,
        default: 0,
      },
    },
    workingHours: {
      Monday: {
        open: String,
        close: String,
        emergency: Boolean,
      },
      Tuesday: {
        open: String,
        close: String,
        emergency: Boolean,
      },
      Wednesday: {
        open: String,
        close: String,
        emergency: Boolean,
      },
      Thursday: {
        open: String,
        close: String,
        emergency: Boolean,
      },
      Friday: {
        open: String,
        close: String,
        emergency: Boolean,
      },
      Saturday: {
        open: String,
        close: String,
        emergency: Boolean,
      },
      Sunday: {
        open: String,
        close: String,
        emergency: Boolean,
      },
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// 2dsphere index for location queries
HospitalSchema.index({ coordinates: '2dsphere' });

// Compound indexes for efficient queries
HospitalSchema.index({ 'address.province': 1, 'address.district': 1 });
HospitalSchema.index({ type: 1, verified: 1 });
HospitalSchema.index({ 'emergency.available': 1 });
HospitalSchema.index({ rating: -1 });

export default mongoose.model<IHospital>('Hospital', HospitalSchema);
