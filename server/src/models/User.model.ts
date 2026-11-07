import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
  dateOfBirth?: string;
  location: string;
  division: string;
  profilePhoto?: string;
  role: 'user' | 'admin';
  isAvailable: boolean;
  lastDonationDate?: string;
  nextEligibleDate?: string;
  totalDonations: number;
  resetPasswordOtp?: string;
  resetPasswordExpires?: Date;
  settings: {
    smsUrgentAlerts: boolean;
    emailDigest: boolean;
    hidePhoneUntilContact: boolean;
    showInDonorDirectory: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
      required: [true, 'Blood group is required'],
      index: true,
    },
    dateOfBirth: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    division: {
      type: String,
      enum: ['Dhaka', 'Chattogram', 'Barishal', 'Khulna', 'Rajshahi', 'Sylhet', 'Rangpur', 'Mymensingh'],
      default: 'Dhaka',
      index: true,
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastDonationDate: {
      type: String,
      default: null,
    },
    nextEligibleDate: {
      type: String,
      default: null,
    },
    totalDonations: {
      type: Number,
      default: 0,
    },
    resetPasswordOtp: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    settings: {
      smsUrgentAlerts: { type: Boolean, default: true },
      emailDigest: { type: Boolean, default: false },
      hidePhoneUntilContact: { type: Boolean, default: false },
      showInDonorDirectory: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

// Method to verify password securely
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User = mongoose.model<IUser>('User', UserSchema);

