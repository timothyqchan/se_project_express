const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItem");

// CRUD

// Create
router.post("/", createItem);

// READ
router.get("/", getItems);

// UPDATE
// router.put("/:itemId", updateItem);

// LIKE ITEM
router.put("/:itemId/likes", likeItem);

// DELETE
router.delete("/:itemId", deleteItem);

// UNLIKE ITEM
router.delete("/:itemId/likes", unlikeItem);

module.exports = router;
