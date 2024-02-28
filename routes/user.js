const router = require("express").Router();

const { getUser, updateUser } = require("../controllers/user");
const { handleAuthorization } = require("../middlewares/auth");
const { userProfileInfoBodyValidator } = require("../middlewares/validation");

// Create
// router.post("/", createUser);

// Read
// router.get("/", getUsers);
router.get("/me", handleAuthorization, getUser);

// Update
router.patch(
  "/me",
  handleAuthorization,
  userProfileInfoBodyValidator,
  updateUser,
);

module.exports = router;
