// src/models/Appointment.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  hospital?: mongoose.Types.ObjectId;
  type: 'Video' | 'In-Person' | 'Chat';
  date: Date;
  timeSlot: string;
  duration: number; // in minutes
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled' | 'No-Show';
  reason: string;
  symptoms?: string[];
  notes?: string;
  prescriptions?: {
    medicine: string;
    dosage: string;
    duration: string;
    instructions: string;
  }[];
  followUp?: Date;
  payment: {
    amount: number;
    currency: string;
    status: 'Pending' | 'Paid' | 'Refunded';
    method?: string;
    transactionId?: string;
  };
  meetingLink?: string;
  rating?: number;
  feedback?: string;
}

const AppointmentSchema: Schema = new Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
    },
    type: {
      type: String,
      enum: ['Video', 'In-Person', 'Chat'],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
      match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
    },
    duration: {
      type: Number,
      default: 30, // 30 minutes default
      min: 15,
      max: 120,
    },
    status: {
      type: String,
      enum: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No-Show'],
      default: 'Scheduled',
    },
    reason: {
      type: String,
      required: [true, 'Please provide appointment reason'],
      maxlength: [500, 'Reason cannot be more than 500 characters'],
    },
    symptoms: {
      type: [String],
    },
    notes: {
      type: String,
      maxlength: [1000, 'Notes cannot be more than 1000 characters'],
    },
    prescriptions: [
      {
        medicine: String,
        dosage: String,
        duration: String,
        instructions: String,
      },
    ],
    followUp: {
      type: Date,
    },
    payment: {
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      currency: {
        type: String,
        default: 'NPR',
      },
      status: {
        type: String,
        enum: ['Pending', 'Paid', 'Refunded'],
        default: 'Pending',
      },
      method: {
        type: String,
        enum: ['Khalti', 'Bank Transfer', 'Cash', 'Online'],
      },
      transactionId: String,
    },
    meetingLink: {
      type: String,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
      maxlength: [1000, 'Feedback cannot be more than 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
AppointmentSchema.index({ patient: 1, date: -1 });
AppointmentSchema.index({ doctor: 1, date: -1 });
AppointmentSchema.index({ status: 1, date: 1 });
AppointmentSchema.index({ 'payment.status': 1 });

// Virtual for appointment end time
AppointmentSchema.virtual('endTime').get(function () {
  const [hours, minutes] = this.timeSlot.split(':').map(Number);
  const startTime = new Date(this.date);
  startTime.setHours(hours, minutes);
  
  const endTime = new Date(startTime.getTime() + this.duration * 60000);
  return endTime.toTimeString().slice(0, 5);
});

// Check if appointment is in the past
AppointmentSchema.virtual('isPast').get(function () {
  const appointmentTime = new Date(this.date);
  const [hours, minutes] = this.timeSlot.split(':').map(Number);
  appointmentTime.setHours(hours, minutes);
  
  const endTime = new Date(appointmentTime.getTime() + this.duration * 60000);
  return endTime < new Date();
});

// Auto-complete past appointments
AppointmentSchema.pre('save', function (next) {
  if (this.isPast && this.status === 'Confirmed') {
    this.status = 'Completed';
  }
  next();
});

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);
