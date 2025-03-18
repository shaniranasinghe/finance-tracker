import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import route from "./routes/userRoute.js";
import authRoutes from "./routes/authRoute.js";
import transactionRoutes from "./routes/transactionRoute.js";
import budgetRoutes from "./routes/budgetRoute.js";
import reportRoutes from "./routes/reportRoute.js";
import "./jobs/recurringTransactionJob.js";
import goalRoutes from "./routes/goalRoute.js";
import notificationRoutes from "./routes/notificationRoute.js";
import systemSettingsRoute from "./routes/systemSettingsRoute.js";
import dashboardRoutes from "./routes/dashboardRoute.js";

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
