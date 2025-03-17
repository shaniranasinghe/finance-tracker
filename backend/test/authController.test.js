import request from "supertest";
import app from "../index.js";
import User from "../model/authModel.js";
import mongoose from "mongoose";
import "../test/setupTestDB.js";

jest.setTimeout(20000);

describe("Auth Controller Tests", () => {
  beforeAll(async () => {
    await User.create({
      username: "testUser",
      email: "test@example.com",
      password: "hashedpassword123", // Mock hashed password
      isVerified: true,
    });
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "newUser", email: "new@example.com", password: "password123" });

    expect(res.status).toBe(201);
  });

//   it("should fail login for incorrect password", async () => {
//     const res = await request(app)
//       .post("/api/auth/login")
//       .send({ email: "test@example.com", password: "wrongpassword" });

//     expect(res.status).toBe(400);
//     expect(res.body.error).toBe("Invalid credentials");
//   });
});
