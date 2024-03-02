const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UnauthorizedError = require("../errors/UnauthorizedError");

const user = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    reqired: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Link is not valid",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: "Email is not valid",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

user.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((currentUser) => {
      if (!currentUser) {
        return Promise.reject(
          new UnauthorizedError("Incorrect email or password"),
        );
      }

      return bcrypt.compare(password, currentUser.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError("Incorrect email or password"),
          );
        }
        return currentUser;
      });
    });
};

module.exports = mongoose.model("user", user);
