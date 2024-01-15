const ClothingItem = require("../models/clothingItem");
const {
  REQUEST_SUCCESSFUL,
  INVALID_DATA_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        return res
          .status(INVALID_DATA_ERROR)
          .send({ message: "Invalid Credentials" });
      }
      return res
        .status(DEFAULT_ERROR)
        .send({ message: "Internal Server Error" });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .orFail()
    .then((items) => {
      res.status(REQUEST_SUCCESSFUL).send(items);
    })
    .catch(() => {
      res.status(DEFAULT_ERROR).send({ message: "Internal Server Error" });
    });
};

// const updateItem = (req, res) => {
//   const { itemId } = req.params;
//   const { imageUrl } = req.body;

//   ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
//     .orFail()
//     .then((item) => {
//       res.status(REQUEST_SUCCESSFUL).send({ data: item });
//     })
//     .catch((e) => {
//       res.status(DEFAULT_ERROR).send({ message: "Internal Server Error" });
//     });
// };

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => {
      res
        .status(REQUEST_SUCCESSFUL)
        .send({ message: "Item ${itemId} Deleted" });
    })
    .catch((e) => {
      if (e.name === "CastError") {
        res
          .status(INVALID_DATA_ERROR)
          .send({ message: "Unauthorized To Delete Item" });
      } else if (e.name === "DocumentNotFoundError") {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: `${e.name} Error On Deleting Item` });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "deleteItem Failed" });
      }
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.status(REQUEST_SUCCESSFUL).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: `${err.name} Error On likeItem` });
      } else if (err.name === "CastError") {
        res.status(INVALID_DATA_ERROR).send({ message: err.message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Internal server error" });
      }
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => res.status(REQUEST_SUCCESSFUL).send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res
          .status(NOT_FOUND_ERROR)
          .send({ message: `${err.name} Error On dislikeItem` });
      } else if (err.name === "CastError") {
        res.status(INVALID_DATA_ERROR).send({ message: err.message });
      } else {
        res.status(DEFAULT_ERROR).send({ message: "Internal server error" });
      }
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
