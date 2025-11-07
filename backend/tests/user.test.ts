import mongoose from "mongoose";
import request from "supertest";
import app from "../src/app";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

let token: string;
let userEmail: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  userEmail = `user${Date.now()}@example.com`; // unique email

  // REGISTER new user
  const registerRes = await request(app)
    .post("/api/auth/register")
    .send({
      username: "testuser",
      email: userEmail,
      password: "password123",
    });

  console.log("Register Response:", registerRes.body);

  // Accept both 200 or 201
  expect([200, 201]).toContain(registerRes.statusCode);
  expect(registerRes.body.success).toBe(true);

  token = registerRes.body.accessToken;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});


describe("User Controller (getMe, updateMe)", () => {
  it("should return current user details (GET /me)", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toHaveProperty("email");
    expect(res.body.user.email).toBe(userEmail);
  });

  it("should update user information (PATCH /me)", async () => {
    const res = await request(app)
      .patch("/api/users/me")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: "updateduser" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user.username).toBe("updateduser");
  });

  it("should return 401 if not authenticated", async () => {
    const res = await request(app).get("/api/users/me");
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
