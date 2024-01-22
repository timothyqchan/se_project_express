const router = require("express").Router();
const { loginUser, createUser } = require("../controllers/user");
const clothingItem = require("./clothingItem");
const user = require("./user");
const { NOT_FOUND_ERROR } = require("../utils/errors");

router.use("/items", clothingItem);
router.use("/users", user);
router.post("/signup", createUser);
router.post("/signin", loginUser);

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: "router not found" });
});

module.exports = router;
