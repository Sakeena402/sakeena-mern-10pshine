import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const signAccessToken = (userId: string) => {
  if (!ACCESS_SECRET) throw new Error("Missing ACCESS secret");
  return jwt.sign({ id: userId }, ACCESS_SECRET, { expiresIn: "15m" });
};

export const signRefreshToken = (userId: string) => {
  if (!REFRESH_SECRET) throw new Error("Missing REFRESH secret");
  return jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string) => {
  if (!ACCESS_SECRET) throw new Error("Missing ACCESS secret");
  return jwt.verify(token, ACCESS_SECRET) as { id: string };
};

export const verifyRefreshToken = (token: string) => {
  if (!REFRESH_SECRET) throw new Error("Missing REFRESH secret");
  return jwt.verify(token, REFRESH_SECRET) as { id: string };
};
