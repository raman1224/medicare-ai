import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalysis extends Document {
  user: mongoose.Types.ObjectId;
  imageUrl: string;
  type: string;
  results: any;
  confidence: number;
  mode?: string;
  createdAt: Date;
}

const AnalysisSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['xray', 'medical', 'medicine'],
    required: true
  },
  results: {
    type: Schema.Types.Mixed,
    required: true
  },
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  mode: {
    type: String,
    enum: ['medicine', 'prescription', 'barcode']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IAnalysis>('Analysis', AnalysisSchema);