const auth = require("../config/firebase-config");

const VerifyToken = async (req, res, next) => {
  try {
    if (req.url === "/" && req.method === "POST") {
      return next();
    }
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      if (token) {
        const user = await auth.verifyIdToken(token);
        if (user) {
          return next();
        } else {
          throw new Error("Authentication Failed");
        }
      }
    }
  } catch (e) {
    throw new Error(`Internal Server Error ${e}`);
  }
};

module.exports = VerifyToken;
