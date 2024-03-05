const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, NODE_ENV } = process.env;
const User = require("../models/user");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const ConflictError = require("../errors/ConflictError");
const InvalidError = require("../errors/InvalidDataError");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!email) {
        return next(new UnauthorizedError("Enter a valid email"));
      }
      if (user) {
        return next(new ConflictError("Email already in use"));
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userPayload = user.toObject();
      delete userPayload.password;
      res.status(201).send({
        data: userPayload,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new InvalidError("Validation Error"));
      } else {
        next(err);
      }
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "secret-key",
        {
          expiresIn: "7d",
        },
      );
      res.send({
        token,
      });
    })
    .catch((err) => {
      next(err);
    });
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError("User not found"))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

// const getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.status(REQUEST_SUCCESSFUL).send(users))
//     .catch(() => {
//       res.status(DEFAULT_ERROR).send({ message: "Internal Server Error" });
//     });
// };

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { runValidators: true, new: true },
  )
    .orFail(new NotFoundError("User not found"))
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { createUser, loginUser, getUser, updateUser };
