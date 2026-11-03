import mongoose, { Schema, Document } from 'mongoose';

export interface IConnection extends Document {
  requestId: mongoose.Types.ObjectId;
  donorId: mongoose.Types.ObjectId;
  requesterId: mongoose.Types.ObjectId;
  contactMethod: 'call' | 'sms' | 'whatsapp';
  status: 'contacted' | 'confirmed' | 'cancelled';
  donorName: string;
  donorPhone: string;
  createdAt: Date;
}

const ConnectionSchema = new Schema<IConnection>(
  {
    requestId: {
      type: Schema.Types.ObjectId,
      ref: 'BloodRequest',
      required: true,
      index: true,
    },
    donorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    contactMethod: {
      type: String,
      enum: ['call', 'sms', 'whatsapp'],
      default: 'call',
    },
    status: {
      type: String,
      enum: ['contacted', 'confirmed', 'cancelled'],
      default: 'contacted',
    },
    donorName: {
      type: String,
      required: true,
    },
    donorPhone: {
      type: String,
      required: true,
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

ConnectionSchema.index({ requestId: 1, donorId: 1 });

export const Connection = mongoose.model<IConnection>('Connection', ConnectionSchema);

