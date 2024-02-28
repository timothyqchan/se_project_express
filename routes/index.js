const router = require("express").Router();
const { loginUser, createUser } = require("../controllers/user");
const clothingItem = require("./clothingItem");
const user = require("./user");
const {
  userBodyValidator,
  userAuthenticationValidator,
} = require("../middlewares/validation");
const { NotFoundError } = require("../errors/notFoundError");

router.use("/items", clothingItem);
router.use("/users", user);
router.post("/signup", userBodyValidator, createUser);
router.post("/signin", userAuthenticationValidator, loginUser);

router.use(() => {
  throw new NotFoundError("Address does not exist");
});

module.exports = router;
