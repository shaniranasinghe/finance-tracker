import request from "supertest";
import app from "../index.js";
import mongoose from "mongoose";
import "../test/setupTestDB.js";
import jwt from "jsonwebtoken";

const testUserId = new mongoose.Types.ObjectId();
const token = jwt.sign({ userId: testUserId.toString(), role: "regular_user" }, process.env.JWT_SECRET, { expiresIn: "1h" });

jest.setTimeout(20000);

beforeAll(async () => {
  await mongoose.connection.collection("systemSettings").insertOne({
    currency: "USD",
    maxBudgetLimit: 10000,
    minTransactionAmount: 1,
    allowRecurringTransactions: true,
  });
});

describe("Transaction Controller", () => {
//   it("should create an expense transaction", async () => {
//     const res = await request(app)
//       .post("/api/transactions")
//       .set("Authorization", `Bearer ${token}`)
//       .send({ type: "expense", amount: 100, category: "Food", currency: "USD", userId: testUserId.toString(), description: "Grocery shopping" });

//     expect(res.status).toBe(201);
//   });

  it("should fetch transactions", async () => {
    const res = await request(app).get("/api/transactions").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});
