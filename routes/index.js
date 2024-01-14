const router = require("express").Router();
const clothingItem = require("./clothingItem");
const usersRouter = require("./user");
const { NOT_FOUND_ERROR } = require("../utils/errors");

router.use("/items", clothingItem);
router.use("/users", usersRouter);

router.use((req, res) => {
  res.status(NOT_FOUND_ERROR).send({ message: "router not found" });
});

module.exports = router;
