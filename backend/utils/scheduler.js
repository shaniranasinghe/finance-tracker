import cron from "node-cron";
import mongoose from "mongoose";
import {
  checkUnusualSpending,
  checkBillReminders,
  checkBudgetAlerts,
  checkGoalReminders,
  checkRecurringTransactions,
} from "../controller/notificationController.js";
import User from "../model/userModel.js";

const runNotificationChecks = async () => {
  try {
    // Check database connection
    if (mongoose.connection.readyState !== 1) {
      console.error("Database not connected. Skipping notification checks.");
      return;
    }

    const users = await User.find({}).lean();

    if (!users || users.length === 0) {
      console.log("No users found for notification processing");
      return;
    }

    console.log(`Processing notifications for ${users.length} users`);

    for (const user of users) {
      try {
        await Promise.all([
          checkUnusualSpending(user._id),
          checkBillReminders(user._id),
          checkBudgetAlerts(user._id),
          checkGoalReminders(user._id),
          checkRecurringTransactions(user._id),
        ]);
      } catch (userError) {
        console.error(
          `Error processing notifications for user ${user._id}:`,
          userError
        );
        // Continue with next user even if one fails
        continue;
      }
    }

    console.log("Notification checks completed successfully");
  } catch (error) {
    console.error("Notification scheduler error:", error);
  }
};

export const startNotificationScheduler = () => {
  console.log("Notification scheduler started");

  // Run immediately when server starts
  runNotificationChecks();

  // Then schedule for midnight every day
  cron.schedule("0 0 * * *", runNotificationChecks);
};
