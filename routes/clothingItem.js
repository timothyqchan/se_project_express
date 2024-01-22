const router = require("express").Router();

const { handleAuthorization } = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItem");

// CRUD

// Create
router.post("/", handleAuthorization, createItem);

// READ
router.get("/", getItems);

// UPDATE
// router.put("/:itemId", updateItem);

// LIKE ITEM
router.put("/:itemId/likes", handleAuthorization, likeItem);

// DELETE
router.delete("/:itemId", handleAuthorization, deleteItem);

// UNLIKE ITEM
router.delete("/:itemId/likes", handleAuthorization, unlikeItem);

module.exports = router;
