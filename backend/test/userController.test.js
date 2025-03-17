import request from "supertest";
import app from "../index.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import "./setupTestDB.js";

jest.setTimeout(20000);

let adminToken; // Declare the adminToken globally

beforeAll(async () => {
  await mongoose.connection.collection("users").deleteMany({});

  const adminUser = await mongoose.connection.collection("users").insertOne({
    username: "testUser",
    email: "test@example.com",
    password: "hashedpassword123",
    role: "admin",
  });

  adminToken = jwt.sign(
    { userId: adminUser.insertedId.toString(), role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
});

describe("User Controller", () => {
//   it("should create a user", async () => {
//     const response = await request(app)
//       .post("/api/users/create")
//       .set("Authorization", `Bearer ${adminToken}`)
//       .send({
//         username: "newUser",
//         email: "new@example.com",
//         password: "password123",
//       });

//     console.log("Create User Response:", response.status, response.body);
//     expect([200, 201]).toContain(response.status);
//     expect(response.body).toHaveProperty("_id");
//   });

  it("should fetch users", async () => {
    const response = await request(app)
      .get("/api/users/getAllUsers")
      .set("Authorization", `Bearer ${adminToken}`);

    console.log("Fetch Users Response:", response.status, response.body);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
