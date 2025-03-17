import request from "supertest";
import app from "../index.js";
import SystemSettings from "../model/systemSettingsModel.js";
import mongoose from "mongoose";
import "../test/setupTestDB.js";
import jwt from "jsonwebtoken";

const testUserId = new mongoose.Types.ObjectId();
const token = jwt.sign({ userId: testUserId.toString(), role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1h" });

jest.setTimeout(20000);

describe("System Settings Controller Tests", () => {
  beforeAll(async () => {
    await SystemSettings.create({
      currency: "USD",
      categories: ["Food", "Transport"],
      limits: { Food: 500 },
    });
  });

//   it("should configure system settings", async () => {
//     const res = await request(app)
//       .post("/api/system-settings")
//       .set("Authorization", `Bearer ${token}`)
//       .send({ categories: ["Rent", "Utilities"], limits: { Rent: 1000 } });

//     expect(res.status).toBe(200);
//     expect(res.body.message).toBe("System settings updated successfully");
//   });

  it("should retrieve system settings", async () => {
    const res = await request(app)
      .get("/api/system-settings")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("categories");
  });
});
