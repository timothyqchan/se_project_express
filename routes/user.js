const router = require("express").Router();

const { getUser, updateUser } = require("../controllers/user");
const { handleAuthorization } = require("../middlewares/auth");

// Create
// router.post("/", createUser);

// Read
// router.get("/", getUsers);
router.get("/me", handleAuthorization, getUser);

// Update
router.put("/me", handleAuthorization, updateUser);

module.exports = router;
