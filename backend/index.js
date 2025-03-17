import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./finance-tracker/config/db.js";
import route from "./finance-tracker/routes/userRoute.js";
import authRoutes from "./finance-tracker/routes/authRoute.js";
import transactionRoutes from "./finance-tracker/routes/transactionRoute.js";
import budgetRoutes from "./finance-tracker/routes/budgetRoute.js";
import reportRoutes from "./finance-tracker/routes/reportRoute.js";
import "./finance-tracker/jobs/recurringTransactionJob.js";
import goalRoutes from "./finance-tracker/routes/goalRoute.js";
import notificationRoutes from "./finance-tracker/routes/notificationRoute.js";
import systemSettingsRoute from "./finance-tracker/routes/systemSettingsRoute.js";
import dashboardRoutes from "./finance-tracker/routes/dashboardRoute.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.MONGO_URL;

// **Prevent connecting to MongoDB in test mode**
if (process.env.NODE_ENV !== 'test') {
  connectDB(MONGOURL);
}

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", route);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/goals', goalRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use('/api/system-settings', systemSettingsRoute);

// Start the server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
  });
}

export default app; // Correctly exporting `app` for tests
