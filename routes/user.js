const router = require("express").Router();

const { createUser, getUser, getUsers } = require("../controllers/user");

//Create
router.post("/", createUser);

//Read
router.get("/", getUsers);
router.get("/:userId", getUser);

module.exports = router;
