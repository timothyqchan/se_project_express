const router = require("express").Router();
const { loginUser, createUser } = require("../controllers/user");
const clothingItem = require("./clothingItem");
const user = require("./user");
const {
  userBodyValidator,
  userAuthenticationValidator,
} = require("../middlewares/validation");
const { handleAuthorization } = require("../middlewares/auth");
const NotFoundError = require("../errors/NotFoundError");

router.use("/items", clothingItem);
router.use("/users", handleAuthorization, user);
router.post("/signup", userBodyValidator, createUser);
router.post("/signin", userAuthenticationValidator, loginUser);

router.use((req, res, next) => {
  next(new NotFoundError("Not Found"));
});

module.exports = router;
