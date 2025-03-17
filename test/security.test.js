import request from "supertest";
import app from "../index.js";
import mongoose from "mongoose"; 
import jwt from "jsonwebtoken";

const testUserId = new mongoose.Types.ObjectId();
const validToken = jwt.sign({ userId: testUserId.toString(), role: "regular_user" }, process.env.JWT_SECRET, { expiresIn: "1h" });
const expiredToken = jwt.sign({ userId: testUserId.toString(), role: "regular_user" }, process.env.JWT_SECRET, { expiresIn: "-1h" });

jest.setTimeout(20000);

describe("🔐 Security Testing", () => {
//   it("🚫 Should reject unauthenticated requests", async () => {
//     const res = await request(app).get("/api/budgets");
//     expect(res.status).toBe(401);
//   });

  it("🚫 Should reject invalid JWT token", async () => {
    const res = await request(app).get("/api/budgets").set("Authorization", "Bearer invalid_token");
    expect(res.status).toBe(401);
  });

  it("🚫 Should reject expired token", async () => {
    const res = await request(app).get("/api/budgets").set("Authorization", `Bearer ${expiredToken}`);
    expect(res.status).toBe(401);
  });

//   it("🚫 Should prevent unauthorized admin access", async () => {
//     const res = await request(app)
//       .delete("/api/users/12345")
//       .set("Authorization", `Bearer ${validToken}`);

//     expect(res.status).toBe(403);
//   });

//   it("🚫 Should prevent SQL Injection in login", async () => {
//     const res = await request(app)
//       .post("/api/auth/login")
//       .send({ email: "' OR 1=1 --", password: "password" });

//     expect(res.status).toBe(400);
//   });

//   it("🚫 Should prevent XSS attack in registration", async () => {
//     const res = await request(app)
//       .post("/api/auth/register")
//       .send({ username: "<script>alert('xss')</script>", email: "test@example.com", password: "password123" });

//     expect(res.status).toBe(400);
//   });

//   it("🚫 Should block excessive login attempts", async () => {
//     for (let i = 0; i < 5; i++) {
//       await request(app).post("/api/auth/login").send({ email: "test@example.com", password: "wrongpassword" });
//     }

//     const res = await request(app).post("/api/auth/login").send({ email: "test@example.com", password: "wrongpassword" });

//     expect(res.status).toBe(429);
//   });
});
