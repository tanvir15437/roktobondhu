import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipientId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'urgent_request' | 'donor_contacted' | 'request_fulfilled' | 'eligibility_reminder' | 'system';
  relatedRequestId?: mongoose.Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['urgent_request', 'donor_contacted', 'request_fulfilled', 'eligibility_reminder', 'system'],
      default: 'urgent_request',
    },
    relatedRequestId: {
      type: Schema.Types.ObjectId,
      ref: 'BloodRequest',
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
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

NotificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

