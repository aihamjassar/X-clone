const jwt = require("jsonwebtoken");

const TOKEN_TTL_MS = 15 * 24 * 60 * 60 * 1000;

exports.generateTokenAndSetCookie = (userId, res) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_TTL_MS / 1000,
  });

  res.cookie("jwt", token, {
    maxAge: TOKEN_TTL_MS,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return token;
};
