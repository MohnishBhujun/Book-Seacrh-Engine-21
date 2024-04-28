const jwt = require("jsonwebtoken");

// Set token secret and expiration time
const secret = "mysecretsshhhhh";
const expirationTime = "2h";

module.exports = {
  generateToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, {
      expiresIn: expirationTime,
      algorithm: "HS256",
    });
  },

  decodeToken: function (token) {
    try {
      const { data } = jwt.verify(token, secret, { algorithms: ["HS256"] });
      return data;
    } catch (error) {
      // Token is invalid or expired
      throw new Error("Invalid or expired token");
    }
  },
};
