const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  REQUEST_SUCCESSFUL,
  INVALID_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
  CONFLICT_ERROR,
  UNAUTHORIZED_ERROR,
} = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!email) {
        throw new Error("Enter a valid email");
      }
      if (user) {
        throw new Error("Email is already in use!");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userPayload = user.toObject();
      delete userPayload.password;
      res.status(REQUEST_SUCCESSFUL).send({
        data: userPayload,
      });
    })
    .catch((err) => {
      if (err.message === "Email is already in use!") {
        res.status(CONFLICT_ERROR).send({ message: err.message });
      } else if (err.message === "Enter a valid email") {
        res
          .status(INVALID_DATA_ERROR)
          .send({ message: "Invalid Request Error On createUser" });
      } else if (err.name === "ValidationError") {
        res.status(INVALID_DATA_ERROR).send({ message: err.message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Error From createUser" });
      }
    });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(INVALID_DATA_ERROR).send({ message: "Invalid credentials" });
    return;
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        res.status(UNAUTHORIZED_ERROR).send({ message: err.message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: err.message });
      }
    });
};

const getUser = (req, res) => {
  // const { userId } = req.params;

  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("User not found"));
      }
      return res.status(REQUEST_SUCCESSFUL).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND_ERROR).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(INVALID_DATA_ERROR).send({ message: "Invalid ID passed" });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Error from getUser" });
      }
    });
};

// const getUsers = (req, res) => {
//   User.find({})
//     .then((users) => res.status(REQUEST_SUCCESSFUL).send(users))
//     .catch(() => {
//       res.status(DEFAULT_ERROR).send({ message: "Internal Server Error" });
//     });
// };

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("User not found"));
      }
      return res.status(REQUEST_SUCCESSFUL).send({ data: user });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND_ERROR).send({ message: err.message });
      } else if (err.name === "ValidationError") {
        res.status(INVALID_DATA_ERROR).send({ message: err.message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Error from updateUser" });
      }
    });
};

module.exports = { createUser, loginUser, getUser, updateUser };
