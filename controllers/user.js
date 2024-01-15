const User = require("../models/user");
const {
  REQUEST_SUCCESSFUL,
  INVALID_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
} = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(INVALID_DATA_ERROR)
          .send({ message: "Invalid Request Error On createUser" });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Error From createUser" });
      }
    });
};

const getUser = (req, res) => {
  const userId = req.params.userId;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(REQUEST_SUCCESSFUL).send({ data: user }))
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

const getUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((users) => res.status(REQUEST_SUCCESSFUL).send(users))
    .catch(() => {
      res.status(DEFAULT_ERROR).send({ message: "Internal Server Error" });
    });
};

module.exports = { createUser, getUser, getUsers };
