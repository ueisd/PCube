const jwt = require("jsonwebtoken");

export function jwtSignId(id, key, timeRefresh) {
  return jwt.sign({}, key, {
    algorithm: "RS256",
    expiresIn: timeRefresh,
    subject: id.toString(),
  });
}
