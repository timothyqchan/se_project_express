const jwt = require("jsonwebtoken");
const { JWT_SECRET, NODE_ENV } = process.env;
const UnauthorizedError = require("../errors/UnauthorizedError");

const handleAuthorization = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new UnauthorizedError("Authorization token is missing"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === "production" ? JWT_SECRET : "secret-key",
    );
  } catch (err) {
    next(new UnauthorizedError("Authorization token is incorrect"));
  }

  req.user = payload;

  next();
};

module.exports = { handleAuthorization };
