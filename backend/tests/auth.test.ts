import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "../src/app"; // path to your express app
import User from "../src/models/User"; // adjust path to your model

dotenv.config();

describe("Auth Routes", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI!);
   await mongoose.connection.dropDatabase(); // <-- add this line
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

 const userData = {
  username: "testuser",
  email: `user${Date.now()}@example.com`, // unique email
  password: "12345678",
};


  let accessToken: string;
  let refreshToken: string;

  it("should register a user successfully", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(userData);

    console.log("Register Response:", res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body.user).toHaveProperty("email", userData.email);
  });

  it("should not register with same email again", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(userData);

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it("should login the user successfully", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: userData.email,
        password: userData.password,
      });

    console.log("Login Response:", res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("accessToken");

    accessToken = res.body.accessToken;
    refreshToken = res.headers["set-cookie"][0]
      .split(";")[0]
      .replace("refreshToken=", "");
  });

  it("should refresh access token successfully", async () => {
    const res = await request(app)
      .post("/api/auth/refresh")
      .set("Cookie", [`refreshToken=${refreshToken}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty("accessToken");
  });

  it("should logout successfully", async () => {
    const res = await request(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should not login with wrong password", async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({
      email: userData.email,
      password: "wrongpassword",
    });

  expect(res.statusCode).toBe(401);
  expect(res.body.success).toBe(false);
  expect(res.body.message).toMatch(/invalid email or password/i);
});

it("should not register with missing fields", async () => {
  const res = await request(app)
    .post("/api/auth/register")
    .send({
      email: "", // missing username and password
    });

  expect(res.statusCode).toBe(400);
  expect(res.body.success).toBe(false);
  expect(res.body.message).toBe("Validation error");
});

it("should not refresh with invalid refresh token", async () => {
  const res = await request(app)
    .post("/api/auth/refresh")
    .set("Cookie", ["refreshToken=invalidtoken123"]);

  expect(res.statusCode).toBe(401);
  expect(res.body.success).toBe(false);
  expect(res.body.message).toMatch(/invalid or expired refresh token/i);
});

});
