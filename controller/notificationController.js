import Transaction from "../model/transactionModel.js";
import Notification from "../model/NotificationModel.js";
import User from "../model/userModel.js";
import { sendEmail } from "../utils/emailService.js";

// Notify about missed recurring transactions
export const notifyMissedRecurringTransactions = async (req, res) => {
  try {
    const today = new Date();

    // Find recurring transactions that were due before today and not completed
    const missedTransactions = await Transaction.find({
      userId: req.user._id,
      isRecurring: true,
      nextNotificationDate: { $lt: today },
    });

    if (missedTransactions.length === 0) {
      return res.status(200).json({ message: "No missed recurring transactions." });
    }

    for (const transaction of missedTransactions) {
      // Create a notification
      await Notification.create({
        user: req.user._id,
        title: "Missed Recurring Transaction",
        message: `You missed a recurring transaction for ${transaction.category} due on ${transaction.nextNotificationDate.toLocaleDateString()}.`,
        type: "RECURRING_TRANSACTION",
        metadata: { transactionId: transaction._id },
      });

      // Send an email to the user
      const user = await User.findById(req.user._id);
      if (user) {
        await sendEmail(user.email, "Missed Recurring Transaction Alert", `You missed a transaction for ${transaction.category}. Please check your dashboard.`);
      }
    }

    res.status(200).json({ message: "Notifications for missed transactions sent successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to notify missed recurring transactions.", details: error.message });
  }
};
