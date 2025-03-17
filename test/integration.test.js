import request from "supertest";
import app from "../index.js";
import mongoose from "mongoose";
import "../test/setupTestDB.js";
import jwt from "jsonwebtoken";

const testUserId = new mongoose.Types.ObjectId();
const adminToken = jwt.sign({ userId: testUserId.toString(), role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });
const userToken = jwt.sign({ userId: testUserId.toString(), role: "regular_user" }, process.env.JWT_SECRET, { expiresIn: "1h" });

jest.setTimeout(30000);

describe("🔄 Integration Testing", () => {
  let budgetId;
  let transactionId;

  beforeAll(async () => {
    await mongoose.connection.collection("systemSettings").insertOne({
      currency: "USD",
      maxBudgetLimit: 10000,
      minTransactionAmount: 1,
      allowRecurringTransactions: true,
    });
  });

//   it("✅ Should register and login a user", async () => {
//     const res = await request(app)
//       .post("/api/auth/register")
//       .send({ username: "testUser", email: "test@example.com", password: "password123" });
//     expect(res.status).toBe(201);

//     const loginRes = await request(app)
//       .post("/api/auth/login")
//       .send({ email: "test@example.com", password: "password123" });
//     expect(loginRes.status).toBe(200);
//     expect(loginRes.body).toHaveProperty("token");
//   });

//   it("✅ Should create a budget", async () => {
//     const res = await request(app)
//       .post("/api/budgets")
//       .set("Authorization", `Bearer ${userToken}`)
//       .send({ category: "Food", amount: 500, month: "April-2025", currency: "USD", userId: testUserId.toString() });

//     expect(res.status).toBe(201);
//     budgetId = res.body.budgetId;
//   });

//   it("✅ Should create a transaction", async () => {
//     const res = await request(app)
//       .post("/api/transactions")
//       .set("Authorization", `Bearer ${userToken}`)
//       .send({
//         type: "expense",
//         amount: 100,
//         category: "Food",
//         currency: "USD",
//         userId: testUserId.toString(),
//         description: "Lunch",
//       });

//     expect(res.status).toBe(201);
//     transactionId = res.body.transactionId;
//   });

//   it("✅ Should fetch budget and transactions", async () => {
//     const budgetRes = await request(app).get(`/api/budgets/${budgetId}`).set("Authorization", `Bearer ${userToken}`);
//     expect(budgetRes.status).toBe(200);

//     const transactionRes = await request(app).get(`/api/transactions/${transactionId}`).set("Authorization", `Bearer ${userToken}`);
//     expect(transactionRes.status).toBe(200);
//   });
  

  it("✅ Should fetch user reports", async () => {
    const res = await request(app).get(`/api/reports/summary?startDate=2025-01-01&endDate=2025-12-31`).set("Authorization", `Bearer ${userToken}`);
    expect(res.status).toBe(200);
  });

//   it("✅ Should log out user", async () => {
//     const res = await request(app).post("/api/auth/logout").set("Authorization", `Bearer ${userToken}`);
//     expect(res.status).toBe(200);
//   });

});
