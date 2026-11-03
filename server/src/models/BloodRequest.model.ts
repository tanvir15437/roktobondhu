import mongoose, { Schema, Document } from 'mongoose';

export type BloodGroupType = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
export type UrgencyType = 'normal' | 'urgent' | 'critical';
export type RequestStatusType = 'active' | 'partially_fulfilled' | 'fulfilled' | 'expired' | 'cancelled';

export interface IBloodRequest extends Document {
  requesterId: mongoose.Types.ObjectId;
  patientName: string;
  patientRelation: string;
  bloodGroup: BloodGroupType;
  unitsRequired: number;
  unitsFulfilled: number;
  hospitalName: string;
  hospitalLocation: string;
  division: string;
  requiredDate: string;
  requiredTime: string;
  contactPhone: string;
  alternatePhone?: string;
  description?: string;
  urgency: UrgencyType;
  status: RequestStatusType;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BloodRequestSchema = new Schema<IBloodRequest>(
  {
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    patientName: {
      type: String,
      required: [true, 'Patient name is required'],
      trim: true,
    },
    patientRelation: {
      type: String,
      required: [true, 'Patient relation is required'],
      trim: true,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
      required: [true, 'Blood group is required'],
      index: true,
    },
    unitsRequired: {
      type: Number,
      required: [true, 'Units required is required'],
      min: [1, 'At least 1 unit required'],
      max: [10, 'Maximum 10 units per request'],
    },
    unitsFulfilled: {
      type: Number,
      default: 0,
      min: 0,
    },
    hospitalName: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
    },
    hospitalLocation: {
      type: String,
      required: [true, 'Hospital location is required'],
      trim: true,
    },
    division: {
      type: String,
      enum: ['Dhaka', 'Chattogram', 'Barishal', 'Khulna', 'Rajshahi', 'Sylhet', 'Rangpur', 'Mymensingh'],
      required: [true, 'Division is required'],
      index: true,
    },
    requiredDate: {
      type: String,
      required: [true, 'Required date is required'],
    },
    requiredTime: {
      type: String,
      required: [true, 'Required time is required'],
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
    },
    alternatePhone: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    urgency: {
      type: String,
      enum: ['normal', 'urgent', 'critical'],
      default: 'urgent',
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'partially_fulfilled', 'fulfilled', 'expired', 'cancelled'],
      default: 'active',
      index: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 48 * 60 * 60 * 1000), // 48h default expiry
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for rapid discovery queries
BloodRequestSchema.index({ status: 1, division: 1, bloodGroup: 1 });
BloodRequestSchema.index({ status: 1, urgency: 1, createdAt: -1 });

export const BloodRequest = mongoose.model<IBloodRequest>('BloodRequest', BloodRequestSchema);

