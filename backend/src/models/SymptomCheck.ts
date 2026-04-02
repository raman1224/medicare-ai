// import mongoose, { Schema, Document } from 'mongoose';

// export interface ISymptomCheck extends Document {
//   user: mongoose.Types.ObjectId;
//   symptoms: string[];
//   age: number;
//   sex: string;
//   temperature: string;
//   bloodPressure: string;
//   duration: string;
//   description: string;
//   foodIntake: string[];
//   medications: string[];
//   diagnosis: Array<{
//     id: string;
//     name: string;
//     commonName: string;
//     probability: string;
//     description: string;
//     severity: string;
//   }>;
//   urgencyLevel: string;
//   recommendations: any;
//   createdAt: Date;
// }

// const SymptomCheckSchema: Schema = new Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   symptoms: [{
//     type: String,
//     required: true
//   }],
//   age: {
//     type: Number,
//     required: true
//   },
//   sex: {
//     type: String,
//     enum: ['male', 'female', 'other'],
//     required: true
//   },
//   temperature: String,
//   bloodPressure: String,
//   duration: String,
//   description: String,
//   foodIntake: [String],
//   medications: [String],
//   diagnosis: [{
//     id: String,
//     name: String,
//     commonName: String,
//     probability: String,
//     description: String,
//     severity: String
//   }],
//   urgencyLevel: {
//     type: String,
//     enum: ['Critical', 'High', 'Moderate', 'Low'],
//     required: true
//   },
//   recommendations: Schema.Types.Mixed,
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// export default mongoose.model<ISymptomCheck>('SymptomCh eck', SymptomCheckSchema);


import mongoose, { Schema, Document } from 'mongoose';

export interface ISymptomCheck extends Document {
  user: mongoose.Types.ObjectId;
  symptoms: string[];
  symptomDetails: Map<string, any>;
  age: number;
  sex: string;
  temperature: string;
  bloodPressure: string;
  duration: string;
  description: string;
  foodIntake: string[];
  medications: string[];
  diagnosis: Array<{
    id: string;
    name: string;
    commonName: string;
    probability: string;
    description: string;
    severity: string;
  }>;
  urgencyLevel: string;
  recommendations: any;
  createdAt: Date;
}

const SymptomCheckSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symptoms: [{
    type: String,
    required: true
  }],
  symptomDetails: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  },
  age: {
    type: Number,
    required: true
  },
  sex: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  temperature: String,
  bloodPressure: String,
  duration: String,
  description: String,
  foodIntake: [String],
  medications: [String],
  diagnosis: [{
    id: String,
    name: String,
    commonName: String,
    probability: String,
    description: String,
    severity: String
  }],
  urgencyLevel: {
    type: String,
    enum: ['Critical', 'High', 'Moderate', 'Low'],
    required: true
  },
  recommendations: Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<ISymptomCheck>('SymptomCheck', SymptomCheckSchema);