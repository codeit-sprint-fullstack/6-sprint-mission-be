const { expressjwt } = require("express-jwt");

const verifyAccessToken = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "user",
});

const auth = {
  verifyAccessToken,
};

module.exports = auth;
