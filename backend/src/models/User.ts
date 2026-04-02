// backend/src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password?: string; // Make password optional
  role: 'patient' | 'doctor' | 'donor' | 'admin';
  country: string;
  language: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  bloodGroup?: string;
  avatar?: string;
  isVerified: boolean;
  googleId?: string;
  githubId?: string;
  authProvider?: 'google' | 'github' | 'local';
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  lastLogin?: Date;
  lastDonation?: Date;
  donorAvailable?: boolean;
  donorVerified?: boolean;
  totalDonations?: number;
  emergencyContact?: string;
  donationHistory?: Array<{
    date: Date;
    hospital: string;
    units: number;
    recipient?: string;
  }>;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    phone: {
      type: String,
      match: [/^[0-9]{10}$/, 'Please provide a valid phone number'],
    },
    password: {
      type: String,
      required: function(this: any) {
        // Password is required only for local auth users
        return !this.googleId && !this.githubId;
      },
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['patient', 'doctor', 'donor', 'admin'],
      default: 'patient',
    },
    country: {
      type: String,
      required: [true, 'Please provide your country'],
      default: 'Nepal',
    },
    language: {
      type: String,
      required: true,
      default: 'en',
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', null],
    },
    avatar: {
      type: String,
      default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },
    authProvider: {
      type: String,
      enum: ['google', 'github', 'local'],
      default: 'local',
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLogin: Date,
    preferences: {
      notifications: {
        type: Boolean,
        default: true,
      },
      darkMode: {
        type: Boolean,
        default: true,
      },
      language: {
        type: String,
        default: 'en',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Hash password before saving - only if password exists
UserSchema.pre<IUser>('save', async function (next) {
  // Only hash password if it exists and is modified
  if (!this.password || !this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  // For OAuth users who don't have password
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  await this.save();
};

// Virtual for age
UserSchema.virtual('age').get(function (this: IUser) {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
});

// Add indexes
UserSchema.index({ googleId: 1 }, { sparse: true });
UserSchema.index({ githubId: 1 }, { sparse: true });
UserSchema.index({ email: 1 });
UserSchema.index({ name: 1 });

export default mongoose.model<IUser>('User', UserSchema);