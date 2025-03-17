import request from "supertest";
import app from "../index.js";

describe("Currency Controller Tests", () => {
  jest.setTimeout(10000);

  it("should fetch exchange rates", async () => {
    const res = await request(app).get("/api/budgets/exchange-rates");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("rates");
  });
});
