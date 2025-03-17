import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      "UNUSUAL_SPENDING",
      "BILL_REMINDER",
      "GOAL_REMINDER",
      "BUDGET_ALERT",
    ],
    required: true,
  },
  status: {
    type: String,
    enum: ["READ", "UNREAD"],
    default: "UNREAD",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

export default mongoose.model("Notification", NotificationSchema);
