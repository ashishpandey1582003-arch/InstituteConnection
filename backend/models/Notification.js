import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a notification title'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please add notification details'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['All', 'Branch-wise', 'Year-wise'],
      default: 'All',
    },
    targetBranches: {
      type: [String], // Array of branch strings (e.g. ['CSE', 'IT'])
      default: [],
    },
    targetYears: {
      type: [Number], // Array of year numbers (e.g. [3, 4])
      default: [],
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
