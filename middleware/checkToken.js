const Jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    Jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.SECRET_KEY,
      function (err, decode) {
        if (err) {
          res.status(401).json({ isSuccess: false, message: "Unauthorized" });
        } else {
          req.user = decode;
          next();
        }
      }
    );
  } else {
    res.status(401).json({ isSuccess: false, message: "Unauthorized" });
  }
};

module.exports = { checkToken };
