const router = require("express").Router();

const { handleAuthorization } = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItem");

const {
  createItemValidator,
  validateId,
} = require("../middlewares/validation");

// CRUD

// Create
router.post("/", handleAuthorization, createItemValidator, createItem);

// READ
router.get("/", getItems);

// UPDATE
// router.put("/:itemId", updateItem);

// LIKE ITEM
router.put("/:itemId/likes", handleAuthorization, validateId, likeItem);

// DELETE
router.delete("/:itemId", handleAuthorization, validateId, deleteItem);

// UNLIKE ITEM
router.delete("/:itemId/likes", handleAuthorization, validateId, unlikeItem);

module.exports = router;
