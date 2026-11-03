import mongoose, { Schema, Document } from 'mongoose';

export interface IDonation extends Document {
  donorId: mongoose.Types.ObjectId;
  donationDate: string;
  hospitalName: string;
  location: string;
  bloodGroup: string;
  units: number;
  notes?: string;
  verified: boolean;
  createdAt: Date;
}

const DonationSchema = new Schema<IDonation>(
  {
    donorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    donationDate: {
      type: String,
      required: [true, 'Donation date is required'],
      index: true,
    },
    hospitalName: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    units: {
      type: Number,
      default: 1,
      min: 1,
      max: 3,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    verified: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

DonationSchema.index({ donorId: 1, donationDate: -1 });

export const Donation = mongoose.model<IDonation>('Donation', DonationSchema);
